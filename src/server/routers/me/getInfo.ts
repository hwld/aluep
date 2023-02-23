import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const getInfo = requireLoggedInProcedure.query(async ({ ctx }) => {
  const loggedInUserId = ctx.session.user.id;

  // ユーザーが投稿したお題のidを取得する
  const themeIds = (
    await prisma.appTheme.findMany({
      select: { id: true },
      where: { userId: loggedInUserId },
    })
  ).map((theme) => theme.id);

  // ユーザーの開発情報のidを取得する
  const developerIds = (
    await prisma.appThemeDeveloper.findMany({
      select: { id: true },
      where: { userId: loggedInUserId },
    })
  ).map((dev) => dev.id);

  // ユーザーが投稿したお題に貰ったいいねの数
  const themeLikes = await prisma.appThemeLike.count({
    where: { appThemeId: { in: themeIds } },
  });

  // ユーザーの開発情報に貰ったいいねの数
  const developLikes = await prisma.appThemeDeveloperLike.count({
    where: { developerId: { in: developerIds } },
  });

  return {
    // ユーザーが投稿したお題の数
    themes: themeIds.length,
    // ユーザーが参加したお題の数
    developers: developerIds.length,
    // ユーザーが貰ったすべてのいいねの数
    allLikes: themeLikes + developLikes,
  };
});
