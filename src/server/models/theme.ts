import { Prisma } from "@prisma/client";
import { formatDistanceStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { z } from "zod";
import { ThemeOrder } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { prisma } from "../prismadb";

export const themeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  user: z.object({
    id: z.string(),
    image: z.string().nullable(),
    name: z.string().nullable(),
  }),
  likes: z.number(),
  developers: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // 作成してからの取得するまでの経過時間
  elapsedSinceCreation: z.string(),
});
export type Theme = z.infer<typeof themeSchema>;

const themeArgs = {
  include: {
    tags: { include: { tag: true, theme: true } },
    user: true,
    _count: { select: { likes: true, developers: true } },
  },
} satisfies Prisma.AppThemeArgs;

const convertTheme = (
  rawTheme: Prisma.AppThemeGetPayload<typeof themeArgs>
): Theme => {
  const theme: Theme = {
    id: rawTheme.id,
    title: rawTheme.title,
    tags: rawTheme.tags.map(({ tag: { id, name } }) => ({ id, name })),
    description: rawTheme.description,
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
  };

  return theme;
};

export const findTheme = async (
  where: Prisma.AppThemeWhereUniqueInput
): Promise<Theme | undefined> => {
  const rawTheme = await prisma.appTheme.findFirst({
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
  const client = transactionClient ?? prisma;

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
};

// TODO: :(
export const searchThemes = async (
  { keyword, tagIds, order }: SearchThemesArgs,
  pagingData: { page: number; limit: number }
): Promise<{ themes: Theme[]; allPages: number }> => {
  if (keyword === "" && tagIds.length === 0) {
    return { themes: [], allPages: 0 };
  }

  // トランザクションを使用する
  const paginatedThemes = await prisma.$transaction(async (tx) => {
    // orderに対応するクエリや並び替え関数を宣言する
    const orderMap: {
      [T in typeof order]: {
        select: Prisma.Sql;
        from: Prisma.Sql;
        orderBy: Prisma.Sql;
        sortFn: (a: Theme, b: Theme) => number;
      };
    } = {
      // 古い順
      createdAsc: {
        select: Prisma.sql`, MAX(AppTheme.createdAt) as themeCreatedAt`,
        from: Prisma.empty,
        orderBy: Prisma.sql`themeCreatedAt asc`,
        sortFn: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      createdDesc: {
        select: Prisma.sql`, MAX(AppTheme.createdAt) as themeCreatedAt`,
        from: Prisma.empty,
        orderBy: Prisma.sql`themeCreatedAt desc`,
        sortFn: (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      },
      likeDesc: {
        select: Prisma.sql`, COUNT(AppThemeLike.id) as likeCounts`,
        from: Prisma.sql`LEFT JOIN AppThemeLike ON (AppTheme.id = AppThemeLike.appThemeId)`,
        orderBy: Prisma.sql`likeCounts desc`,
        sortFn: (a, b) => b.likes - a.likes,
      },
      developerDesc: {
        select: Prisma.sql`, COUNT(AppThemeDeveloper.id) as developerCounts`,
        from: Prisma.sql`LEFT JOIN AppThemeDeveloper ON (AppTheme.id = AppThemeDeveloper.appThemeId)`,
        orderBy: Prisma.sql`developerCounts desc`,
        sortFn: (a, b) => b.developers - a.developers,
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
    // idを正しい順番で並び変えた後にページングが行われるので、ページ単位では正しい結果になってるはず
    // なので、ページ単位の並び替えで十分だと思う
    const sortedThemes = [...themes].sort(orderMap[order].sortFn);

    return { themes: sortedThemes, allPages };
  });

  return paginatedThemes;
};
