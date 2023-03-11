import { Prisma } from "@prisma/client";
import { formatDistanceStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { ThemeOrder, ThemePeriod } from "../../share/schema";
import { sortedInSameOrder } from "../../share/utils";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

export type Theme = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  likes: number;
  id: string;
  title: string;
  descriptionHtml: string;
  tags: {
    id: string;
    name: string;
  }[];
  developers: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  /** 作成してから取得するまでの経過時間 */
  elapsedSinceCreation: string;
};

const themeArgs = {
  include: {
    tags: { include: { tag: true, theme: true } },
    user: true,
    _count: { select: { likes: true, developers: true, comments: true } },
  },
} satisfies Prisma.AppThemeArgs;

const convertTheme = (
  rawTheme: Prisma.AppThemeGetPayload<typeof themeArgs>
): Theme => {
  const theme: Theme = {
    id: rawTheme.id,
    title: rawTheme.title,
    tags: rawTheme.tags.map(({ tag: { id, name } }) => ({ id, name })),
    descriptionHtml: rawTheme.description,
    createdAt: rawTheme.createdAt.toUTCString(),
    elapsedSinceCreation: formatDistanceStrict(rawTheme.createdAt, new Date(), {
      addSuffix: true,
      locale: ja,
    }),
    updatedAt: rawTheme.updatedAt.toUTCString(),
    user: {
      id: rawTheme.user.id,
      name: rawTheme.user.name,
      image: rawTheme.user.image,
    },
    likes: rawTheme._count.likes,
    developers: rawTheme._count.developers,
    comments: rawTheme._count.comments,
  };

  return theme;
};

export const findTheme = async (
  where: Prisma.AppThemeWhereUniqueInput
): Promise<Theme | undefined> => {
  const rawTheme = await db.appTheme.findFirst({
    where,
    ...themeArgs,
  });

  if (!rawTheme) {
    return undefined;
  }

  const theme = convertTheme(rawTheme);
  return theme;
};

export const findManyThemes = async (
  {
    orderBy,
    ...args
  }: OmitStrict<Prisma.AppThemeFindManyArgs, "include" | "select">,
  transactionClient?: Prisma.TransactionClient
) => {
  const client = transactionClient ?? db;

  const rawThemes = await client.appTheme.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...themeArgs,
  });
  const themes = rawThemes.map(convertTheme);
  return themes;
};

type SearchThemesArgs = {
  keyword: string;
  tagIds: string[];
  order: ThemeOrder;
  period: ThemePeriod;
};

export const pickUpThemes = async (
  order: ThemeOrder,
  limit: number
): Promise<Theme[]> => {
  const paginatedThemes = await db.$transaction(async (tx) => {
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
        select: Prisma.sql`, MAX(AppTheme.createdAt) as themeCreatedAt`,
        from: Prisma.empty,
        orderBy: Prisma.sql`themeCreatedAt asc`,
      },
      createdDesc: {
        select: Prisma.sql`, MAX(AppTheme.createdAt) as themeCreatedAt`,
        from: Prisma.empty,
        orderBy: Prisma.sql`themeCreatedAt desc`,
      },
      likeDesc: {
        select: Prisma.sql`, COUNT(AppThemeLike.id) as likeCounts`,
        from: Prisma.sql`LEFT JOIN AppThemeLike ON (AppTheme.id = AppThemeLike.appThemeId)`,
        orderBy: Prisma.sql`likeCounts desc`,
      },
      developerDesc: {
        select: Prisma.sql`, COUNT(AppThemeDeveloper.id) as developerCounts`,
        from: Prisma.sql`LEFT JOIN AppThemeDeveloper ON (AppTheme.id = AppThemeDeveloper.appThemeId)`,
        orderBy: Prisma.sql`developerCounts desc`,
      },
    };

    // マスタとなるクエリを作る
    const master = Prisma.sql`
      (
        SELECT
          AppTheme.id as themeId
          ${orderMap[order].select}
        FROM
          AppTheme
          ${orderMap[order].from}
        GROUP BY
          AppTheme.id
        ORDER BY
          ${orderMap[order].orderBy}
      ) master
    `;

    // お題のidのリストを求める
    type ThemeIds = { themeId: string }[];
    const themeIdObjs = await tx.$queryRaw<ThemeIds>`
      SELECT 
        * 
      FROM
        ${master}
      LIMIT 
        ${limit}
    `;
    const pickUpedThemeIds = themeIdObjs.map(({ themeId }) => themeId);

    const themes = await findManyThemes(
      { where: { id: { in: pickUpedThemeIds } } },
      tx
    );

    const sortedThemes = sortedInSameOrder({
      target: themes,
      base: pickUpedThemeIds,
      getKey: (t) => t.id,
    });

    return sortedThemes;
  });

  return paginatedThemes;
};

export const searchThemes = async (
  { keyword, tagIds, order, period }: SearchThemesArgs,
  pagingData: { page: number; limit: number }
): Promise<{ themes: Theme[]; allPages: number }> => {
  // トランザクションを使用する
  const paginatedThemes = await db.$transaction(async (tx) => {
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
        select: Prisma.sql`, MAX(AppTheme.createdAt) as themeCreatedAt`,
        from: Prisma.empty,
        orderBy: Prisma.sql`themeCreatedAt asc`,
      },
      createdDesc: {
        select: Prisma.sql`, MAX(AppTheme.createdAt) as themeCreatedAt`,
        from: Prisma.empty,
        orderBy: Prisma.sql`themeCreatedAt desc`,
      },
      likeDesc: {
        select: Prisma.sql`, COUNT(AppThemeLike.id) as likeCounts`,
        from: Prisma.sql`LEFT JOIN AppThemeLike ON (AppTheme.id = AppThemeLike.appThemeId)`,
        orderBy: Prisma.sql`likeCounts desc`,
      },
      developerDesc: {
        select: Prisma.sql`, COUNT(AppThemeDeveloper.id) as developerCounts`,
        from: Prisma.sql`LEFT JOIN AppThemeDeveloper ON (AppTheme.id = AppThemeDeveloper.appThemeId)`,
        orderBy: Prisma.sql`developerCounts desc`,
      },
    };

    // マスタとなるクエリを作る
    const master = Prisma.sql`
      (
        SELECT
          AppTheme.id as themeId
          ${orderMap[order].select}
        FROM
          AppTheme
          LEFT JOIN AppThemeTagOnAppTheme
            ON (AppTheme.id = AppThemeTagOnAppTheme.themeId)
          ${orderMap[order].from}
        WHERE
          AppTheme.title LIKE ${"%" + keyword + "%"}
          ${
            period === "monthly"
              ? Prisma.sql`
          AND AppTheme.createdAt > (NOW() - INTERVAL 1 MONTH)`
              : Prisma.empty
          }
          ${
            tagIds.length > 0
              ? Prisma.sql`
          AND tagId IN (${Prisma.join(tagIds)})`
              : Prisma.empty
          }
        GROUP BY
          AppTheme.id
        ${
          tagIds.length > 0
            ? Prisma.sql`
        HAVING
          COUNT(themeId) = ${tagIds.length}`
            : Prisma.empty
        }
        ORDER BY
          ${orderMap[order].orderBy}
      ) master
    `;

    // お題のidのリストを求める
    type SearchedThemeIds = { themeId: string }[];
    const themeIdObjs = await tx.$queryRaw<SearchedThemeIds>`
      SELECT 
        * 
      FROM
        ${master}
      LIMIT 
        ${pagingData.limit}
      OFFSET
        ${(pagingData.page - 1) * pagingData.limit}
    `;
    const searchedThemeIds = themeIdObjs.map(({ themeId }) => themeId);

    // 検索結果の合計数を求める
    const allItemsArray = await tx.$queryRaw<[{ allItems: BigInt }]>`
      SELECT
        COUNT(*) as allItems
      FROM ${master}
    `;
    const allItems = Number(allItemsArray[0].allItems);
    const allPages = Math.ceil(allItems / pagingData?.limit);

    const themes = await findManyThemes(
      { where: { id: { in: searchedThemeIds } } },
      tx
    );

    // searchedThemeIdsの並び順が保持されないので、並び替え直す。
    const sortedThemes = sortedInSameOrder({
      target: themes,
      base: searchedThemeIds,
      getKey: (t) => t.id,
    });

    return { themes: sortedThemes, allPages };
  });

  return paginatedThemes;
};
