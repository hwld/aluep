import { Idea, IdeaOrder, IdeaPeriod } from "@/models/idea";
import { FindFirstArgs, FindManyArgs } from "@/server/finders";
import { db } from "@/server/lib/prismadb";
import { sortedInSameOrder } from "@/share/utils";
import { Prisma } from "@prisma/client";
import { formatDistanceStrict } from "date-fns";
import { ja } from "date-fns/locale";

const ideaArgs = {
  include: {
    tags: { include: { tag: true, idea: true } },
    user: true,
    likes: true,
    developments: true,
    _count: { select: { likes: true, developments: true, comments: true } },
  },
} satisfies Prisma.IdeaDefaultArgs;

const convertIdea = (
  rawIdea: Prisma.IdeaGetPayload<typeof ideaArgs>,
  loggedInUserId: string | undefined
): Idea => {
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
    devs: rawIdea._count.developments,
    comments: rawIdea._count.comments,
    likedByLoggedInUser: rawIdea.likes.find((l) => l.userId === loggedInUserId)
      ? true
      : false,
    loggedInUserDevId: rawIdea.developments.find(
      (d) => d.userId === loggedInUserId
    )?.id,
  };

  return idea;
};

type FindIdeaArgs = FindFirstArgs<
  typeof db.idea,
  { loggedInUserId: string | undefined }
>;

export const findIdea = async ({
  loggedInUserId,
  ...args
}: FindIdeaArgs): Promise<Idea | undefined> => {
  const rawIdea = await db.idea.findFirst({
    ...args,
    ...ideaArgs,
  });

  if (!rawIdea) {
    return undefined;
  }

  const idea = convertIdea(rawIdea, loggedInUserId);
  return idea;
};

type FindIdeasArgs = FindManyArgs<
  typeof db.idea,
  {
    loggedInUserId: string | undefined;
    transactionClient?: Prisma.TransactionClient;
  }
>;

export const findManyIdeas = async ({
  orderBy,
  loggedInUserId,
  transactionClient,
  ...args
}: FindIdeasArgs) => {
  const client = transactionClient ?? db;

  const rawIdeas = await client.idea.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...ideaArgs,
  });
  const ideas = rawIdeas.map((r) => convertIdea(r, loggedInUserId));
  return ideas;
};

type SearchIdeasArgs = {
  keyword: string;
  tagIds: string[];
  order: IdeaOrder;
  period: IdeaPeriod;
};

type PickUpIdeasArgs = {
  order: IdeaOrder;
  limit: number;
  loggedInUserId: string | undefined;
};

export const pickUpIdeas = async ({
  order,
  limit,
  loggedInUserId,
}: PickUpIdeasArgs): Promise<Idea[]> => {
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
      devDesc: {
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

    const ideas = await findManyIdeas({
      where: { id: { in: pickUpedIdeaIds } },
      transactionClient: tx,
      loggedInUserId,
    });

    const sortedIdeas = sortedInSameOrder({
      target: ideas,
      base: pickUpedIdeaIds,
      getKey: (t) => t.id,
    });

    return sortedIdeas;
  });

  return paginatedIdeas;
};

type FindSearchedIdeasArgs = {
  searchArgs: SearchIdeasArgs;
  pagingData: { page: number; limit: number };
  loggedInUserId: string | undefined;
};

/** 条件を指定してお題を取得する */
export const findSearchedIdeas = async ({
  searchArgs: { keyword, tagIds, order, period },
  pagingData,
  loggedInUserId,
}: FindSearchedIdeasArgs): Promise<{ ideas: Idea[]; allPages: number }> => {
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
      devDesc: {
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

    const ideas = await findManyIdeas({
      where: { id: { in: searchedIdeaIds } },
      transactionClient: tx,
      loggedInUserId,
    });

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
