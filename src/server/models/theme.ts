import { Prisma } from "@prisma/client";
import { z } from "zod";
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
});
export type Theme = z.infer<typeof themeSchema>;

const themeArgs = {
  include: {
    tags: { include: { tag: true, theme: true } },
    user: true,
    // TODO
    // こうすると正しく数えてくれないので、
    _count: { select: { likes: true, developers: true } },
    // すべて取得してその数を数える。 数が多くなってきたときにどうなるだろうか。
    // likes: { select: { id: true } },
    // developers: { select: { id: true } },
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

type SearchThemesArgs = { keyword: string; tagIds: string[] };
export const searchThemes = async (
  { keyword, tagIds }: SearchThemesArgs,
  pagingData: { page: number; limit: number }
): Promise<{ themes: Theme[]; allPages: number }> => {
  if (keyword === "" && tagIds.length === 0) {
    return { themes: [], allPages: 0 };
  }

  // トランザクションを使用する
  const paginatedThemes = await prisma.$transaction(async (tx) => {
    const master = Prisma.sql`
      (
        SELECT
          AppTheme.id as themeId
        FROM
          AppTheme
          LEFT JOIN AppThemeTagOnAppTheme
            ON (AppTheme.id = AppThemeTagOnAppTheme.themeId)
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
    return { themes, allPages };
  });

  return paginatedThemes;
};
