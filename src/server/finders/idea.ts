import { Idea, IdeaOrder, IdeaPeriod } from "@/models/idea";
import { sortedInSameOrder } from "@/share/utils";
import { formatDistanceStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { DbArgs, __new_db__ } from "@/server/lib/db";
import { inArray, SQL, sql } from "drizzle-orm";
import { dbSchema } from "@/server/dbSchema";

type FindFirstArgs = DbArgs<"ideas", "findFirst">;
type FindManyArgs = DbArgs<"ideas", "findMany">;
const _ideaArgs = {
  with: {
    ideaTagOnIdea: { with: { ideaTag: true } },
    user: true,
    likes: true,
    developments: true,
    comments: true,
  },
} satisfies FindFirstArgs;

type Payload = NonNullable<
  Awaited<ReturnType<typeof __new_db__.query.ideas.findFirst<typeof _ideaArgs>>>
>;

const convertIdea = (
  raw: Payload,
  loggedInUserId: string | undefined
): Idea => {
  return {
    id: raw.id,
    title: raw.title,
    tags: raw.ideaTagOnIdea.map((t) => ({ id: t.tagId, name: t.ideaTag.name })),
    descriptionHtml: raw.description,
    createdAt: raw.createdAt,
    elapsedSinceCreation: formatDistanceStrict(
      new Date(raw.createdAt),
      new Date(),
      { addSuffix: true, locale: ja }
    ),
    updatedAt: raw.updatedAt,
    user: {
      id: raw.user.id,
      name: raw.user.name,
      image: raw.user.image,
    },
    likes: raw.likes.length,
    devs: raw.developments.length,
    comments: raw.comments.length,
    likedByLoggedInUser: raw.likes.find((l) => l.userId === loggedInUserId)
      ? true
      : false,
    loggedInUserDevId: raw.developments.find((d) => d.userId === loggedInUserId)
      ?.id,
  };
};

export const findIdea = async ({
  args,
  loggedInUserId,
}: {
  //TODO: columnsとwithを消したいがOmitが動かない・・・
  args: FindFirstArgs;
  loggedInUserId: string | undefined;
}): Promise<Idea | undefined> => {
  const raw = await __new_db__.query.ideas.findFirst({ ...args, ..._ideaArgs });

  if (!raw) {
    return undefined;
  }

  const idea = convertIdea(raw, loggedInUserId);
  return idea;
};

export const findManyIdeas = async ({
  args,
  loggedInUserId,
  transactionClient,
}: {
  args: FindManyArgs;
  loggedInUserId: string | undefined;
  transactionClient?: typeof __new_db__;
}): Promise<Idea[]> => {
  const client = transactionClient ?? __new_db__;

  const raws = await client.query.ideas.findMany({ ...args, ..._ideaArgs });
  const ideas = raws.map((r) => convertIdea(r, loggedInUserId));
  return ideas;
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
  const pickedUpIdeas = await __new_db__.transaction(async (tx) => {
    const orderMap: {
      [T in typeof order]: {
        select: SQL;
        from: SQL;
        having?: SQL;
        orderBy: SQL;
      };
    } = {
      // 古い順
      createdAsc: {
        select: sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: sql.empty(),
        orderBy: sql`"ideaCreatedAt" asc`,
      },
      createdDesc: {
        select: sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: sql.empty(),
        orderBy: sql`"ideaCreatedAt" desc`,
      },
      likeDesc: {
        select: sql`, COUNT(idea_likes.id) as "likeCounts"`,
        from: sql`LEFT JOIN idea_likes ON (ideas.id = idea_likes."ideaId")`,
        having: sql`COUNT(idea_likes.id) > 0`,
        orderBy: sql`"likeCounts" desc`,
      },
      devDesc: {
        select: sql`, COUNT(developments.id) as "developmentCounts"`,
        from: sql`LEFT JOIN developments ON (ideas.id = developments."ideaId")`,
        having: sql`COUNT(developments.id) > 0`,
        orderBy: sql`"developmentCounts" desc`,
      },
    };

    // マスタとなるクエリを作る
    const master = sql`
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
          ? sql`
      HAVING
        ${orderMap[order].having}
      `
          : sql.empty()
      }
      ORDER BY
        ${orderMap[order].orderBy}
    ) master
    `;

    // お題のidのリストを求める
    const ideaIdObjs = await tx.execute<{ ideaId: string }>(sql`
      SELECT
        *
      FROM
        ${master}
      LIMIT
        ${limit}
    `);
    const pickedUpIdeaIds = ideaIdObjs.map((i) => i.ideaId);

    const ideas =
      pickedUpIdeaIds.length === 0
        ? []
        : await findManyIdeas({
            args: { where: inArray(dbSchema.ideas.id, pickedUpIdeaIds) },
            transactionClient: tx,
            loggedInUserId,
          });

    const sortedIdeas = sortedInSameOrder({
      target: ideas,
      base: pickedUpIdeaIds,
      getKey: (t) => t.id,
    });

    return sortedIdeas;
  });

  return pickedUpIdeas;
};

type SearchIdeasArgs = {
  keyword: string;
  tagIds: string[];
  order: IdeaOrder;
  period: IdeaPeriod;
};
type FindSearchedIdeasArgs = {
  searchArgs: SearchIdeasArgs;
  pagingData: { page: number; limit: number };
  loggedInUserId: string | undefined;
};
export const findSearchedIdeas = async ({
  searchArgs: { keyword, tagIds, order, period },
  pagingData,
  loggedInUserId,
}: FindSearchedIdeasArgs): Promise<{ ideas: Idea[]; allPages: number }> => {
  // トランザクションを使用する
  const paginatedIdeas = await __new_db__.transaction(async (tx) => {
    // orderに対応するクエリや並び替え関数を宣言する
    const orderMap: {
      [T in typeof order]: {
        select: SQL;
        from: SQL;
        orderBy: SQL;
      };
    } = {
      // 古い順
      createdAsc: {
        select: sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: sql.empty(),
        orderBy: sql`"ideaCreatedAt" asc`,
      },
      createdDesc: {
        select: sql`, MAX(ideas."createdAt") as "ideaCreatedAt"`,
        from: sql.empty(),
        orderBy: sql`"ideaCreatedAt" desc`,
      },
      likeDesc: {
        select: sql`, COUNT(idea_likes.id) as "likeCounts"`,
        from: sql`LEFT JOIN idea_likes ON (ideas.id = idea_likes."ideaId")`,
        orderBy: sql`"likeCounts" desc`,
      },
      devDesc: {
        select: sql`, COUNT(developments.id) as "developmentCounts"`,
        from: sql`LEFT JOIN developments ON (ideas.id = developments."ideaId")`,
        orderBy: sql`"developmentCounts" desc`,
      },
    };

    // マスタとなるクエリを作る
    const master = sql`
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
              ? sql`
          AND ideas."createdAt" > (NOW() - INTERVAL '1 MONTH')`
              : sql.empty()
          }
          ${
            tagIds.length > 0
              ? sql`
          AND "tagId" IN (${sql.join(tagIds, ", ")})`
              : sql.empty()
          }
        GROUP BY
          ideas.id
        ${
          tagIds.length > 0
            ? sql`
        HAVING
          COUNT("ideaId") = ${tagIds.length}`
            : sql.empty()
        }
        ORDER BY
          ${orderMap[order].orderBy}
      ) master
    `;

    // お題のidのリストを求める
    const ideaIdObjs = await tx.execute<{ ideaId: string }>(sql`
      SELECT 
        * 
      FROM
        ${master}
      LIMIT 
        ${pagingData.limit}
      OFFSET
        ${(pagingData.page - 1) * pagingData.limit}
    `);
    const searchedIdeaIds = ideaIdObjs.map(({ ideaId }) => ideaId);

    // 検索結果の合計数を求める
    const allItemsArray = await tx.execute<{ allItems: BigInt }>(sql`
      SELECT
        COUNT(*) as "allItems"
      FROM ${master}
    `);
    const allItems = Number(allItemsArray[0].allItems);
    const allPages = Math.ceil(allItems / pagingData?.limit);

    const ideas =
      searchedIdeaIds.length === 0
        ? []
        : await findManyIdeas({
            args: { where: inArray(dbSchema.ideas.id, searchedIdeaIds) },
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
