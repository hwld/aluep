import { Idea, IdeaOrder, IdeaPeriod } from "@/models/idea";
import { db } from "@/server/lib/prismadb";
import { sortedInSameOrder } from "@/share/utils";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";
import { formatDistanceStrict } from "date-fns";
import { ja } from "date-fns/locale";

const ideaArgs = {
  include: {
    tags: { include: { tag: true, idea: true } },
    user: true,
    _count: { select: { likes: true, developments: true, comments: true } },
  },
} satisfies Prisma.IdeaArgs;

const convertIdea = (rawIdea: Prisma.IdeaGetPayload<typeof ideaArgs>): Idea => {
  const idea: Idea = {
    id: rawIdea.id,
    title: rawIdea.title,
    tags: rawIdea.tags.map(({ tag: { id, name } }) => ({ id, name })),
    descriptionHtml: rawIdea.description,
    createdAt: rawIdea.createdAt.toUTCString(),
    elapsedSinceCreation: formatDistanceStrict(rawIdea.createdAt, new Date(), {
      addSuffix: true,
      locale: ja,
    }),
    updatedAt: rawIdea.updatedAt.toUTCString(),
    user: {
      id: rawIdea.user.id,
      name: rawIdea.user.name,
      image: rawIdea.user.image,
    },
    likes: rawIdea._count.likes,
    developments: rawIdea._count.developments,
    comments: rawIdea._count.comments,
  };

  return idea;
};

export const findIdea = async (
  where: Prisma.IdeaWhereUniqueInput
): Promise<Idea | undefined> => {
  const rawIdea = await db.idea.findFirst({
    where,
    ...ideaArgs,
  });

  if (!rawIdea) {
    return undefined;
  }

  const idea = convertIdea(rawIdea);
  return idea;
};

export const findManyIdeas = async (
  {
    orderBy,
    ...args
  }: OmitStrict<Prisma.IdeaFindManyArgs, "include" | "select">,
  transactionClient?: Prisma.TransactionClient
) => {
  const client = transactionClient ?? db;

  const rawIdeas = await client.idea.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...ideaArgs,
  });
  const ideas = rawIdeas.map(convertIdea);
  return ideas;
};

type SearchIdeasArgs = {
  keyword: string;
  tagIds: string[];
  order: IdeaOrder;
  period: IdeaPeriod;
};

export const pickUpIdeas = async (
  order: IdeaOrder,
  limit: number
): Promise<Idea[]> => {
  const paginatedIdeas = await db.$transaction(async (tx) => {
    // orderに対応するクエリや並び替え関数を宣言する
    const orderMap: {
      [T in typeof order]: {
        select: Prisma.Sql;
        from: Prisma.Sql;
        having?: Prisma.Sql;
        orderBy: Prisma.Sql;
      };
    } = {
      // 古い順
      createdAsc: {
        select: Prisma.sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: Prisma.empty,
        orderBy: Prisma.sql`"ideaCreatedAt" asc`,
      },
      createdDesc: {
        select: Prisma.sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: Prisma.empty,
        orderBy: Prisma.sql`"ideaCreatedAt" desc`,
      },
      likeDesc: {
        select: Prisma.sql`, COUNT(idea_likes.id) as "likeCounts"`,
        from: Prisma.sql`LEFT JOIN idea_likes ON (ideas.id = idea_likes."ideaId")`,
        having: Prisma.sql`COUNT(idea_likes.id) > 0`,
        orderBy: Prisma.sql`"likeCounts" desc`,
      },
      developmentDesc: {
        select: Prisma.sql`, COUNT(developments.id) as "developmentCounts"`,
        from: Prisma.sql`LEFT JOIN developments ON (ideas.id = developments."ideaId")`,
        having: Prisma.sql`COUNT(developments.id) > 0`,
        orderBy: Prisma.sql`"developmentCounts" desc`,
      },
    };

    // マスタとなるクエリを作る
    const master = Prisma.sql`
      (
        SELECT
          ideas.id as "ideaId"
          ${orderMap[order].select}
        FROM
          ideas
          ${orderMap[order].from}
        GROUP BY
          ideas.id
        ${
          orderMap[order].having !== undefined
            ? Prisma.sql`
          HAVING
            ${orderMap[order].having}
          `
            : Prisma.empty
        }
        ORDER BY
          ${orderMap[order].orderBy}
      ) master
    `;

    // お題のidのリストを求める
    type IdeaIds = { ideaId: string }[];
    const ideaIdObjs = await tx.$queryRaw<IdeaIds>`
      SELECT 
        * 
      FROM
        ${master}
      LIMIT 
        ${limit}
    `;
    const pickUpedIdeaIds = ideaIdObjs.map(({ ideaId }) => ideaId);

    const ideas = await findManyIdeas(
      { where: { id: { in: pickUpedIdeaIds } } },
      tx
    );

    const sortedIdeas = sortedInSameOrder({
      target: ideas,
      base: pickUpedIdeaIds,
      getKey: (t) => t.id,
    });

    return sortedIdeas;
  });

  return paginatedIdeas;
};

/** 条件を指定してお題を取得する */
export const findSearchedIdeas = async (
  { keyword, tagIds, order, period }: SearchIdeasArgs,
  pagingData: { page: number; limit: number }
): Promise<{ ideas: Idea[]; allPages: number }> => {
  // トランザクションを使用する
  const paginatedIdeas = await db.$transaction(async (tx) => {
    // orderに対応するクエリや並び替え関数を宣言する
    const orderMap: {
      [T in typeof order]: {
        select: Prisma.Sql;
        from: Prisma.Sql;
        orderBy: Prisma.Sql;
      };
    } = {
      // 古い順
      createdAsc: {
        select: Prisma.sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: Prisma.empty,
        orderBy: Prisma.sql`"ideaCreatedAt" asc`,
      },
      createdDesc: {
        select: Prisma.sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: Prisma.empty,
        orderBy: Prisma.sql`"ideaCreatedAt" desc`,
      },
      likeDesc: {
        select: Prisma.sql`, COUNT(idea_likes.id) as "likeCounts"`,
        from: Prisma.sql`LEFT JOIN idea_likes ON (ideas.id = idea_likes."ideaId")`,
        orderBy: Prisma.sql`"likeCounts" desc`,
      },
      developmentDesc: {
        select: Prisma.sql`, COUNT(developments.id) as "developmentCounts"`,
        from: Prisma.sql`LEFT JOIN developments ON (ideas.id = developments."ideaId")`,
        orderBy: Prisma.sql`"developmentCounts" desc`,
      },
    };

    // マスタとなるクエリを作る
    const master = Prisma.sql`
      (
        SELECT
          ideas.id as "ideaId"
          ${orderMap[order].select}
        FROM
          ideas
          LEFT JOIN idea_tag_on_ideas
            ON (ideas.id = idea_tag_on_ideas."ideaId")
          ${orderMap[order].from}
        WHERE
          ideas.title LIKE ${"%" + keyword + "%"}
          ${
            period === "monthly"
              ? Prisma.sql`
          AND ideas."createdAt" > (NOW() - INTERVAL '1 MONTH')`
              : Prisma.empty
          }
          ${
            tagIds.length > 0
              ? Prisma.sql`
          AND "tagId" IN (${Prisma.join(tagIds)})`
              : Prisma.empty
          }
        GROUP BY
          ideas.id
        ${
          tagIds.length > 0
            ? Prisma.sql`
        HAVING
          COUNT("ideaId") = ${tagIds.length}`
            : Prisma.empty
        }
        ORDER BY
          ${orderMap[order].orderBy}
      ) master
    `;

    // お題のidのリストを求める
    type SearchedIdeaIds = { ideaId: string }[];
    const ideaIdObjs = await tx.$queryRaw<SearchedIdeaIds>`
      SELECT 
        * 
      FROM
        ${master}
      LIMIT 
        ${pagingData.limit}
      OFFSET
        ${(pagingData.page - 1) * pagingData.limit}
    `;
    const searchedIdeaIds = ideaIdObjs.map(({ ideaId }) => ideaId);

    // 検索結果の合計数を求める
    const allItemsArray = await tx.$queryRaw<[{ allItems: BigInt }]>`
      SELECT
        COUNT(*) as "allItems"
      FROM ${master}
    `;
    const allItems = Number(allItemsArray[0].allItems);
    const allPages = Math.ceil(allItems / pagingData?.limit);

    const ideas = await findManyIdeas(
      { where: { id: { in: searchedIdeaIds } } },
      tx
    );

    // searchedIdeaIdsの並び順が保持されないので、並び替え直す。
    const sortedIdeas = sortedInSameOrder({
      target: ideas,
      base: searchedIdeaIds,
      getKey: (t) => t.id,
    });

    return { ideas: sortedIdeas, allPages };
  });

  return paginatedIdeas;
};
