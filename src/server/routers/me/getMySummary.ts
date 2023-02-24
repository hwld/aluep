import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const getMySummary = requireLoggedInProcedure.query(async ({ ctx }) => {
  const loggedInUserId = ctx.session.user.id;

  // ユーザーが投稿したお題のidを取得する
  const themeIds = (
    await db.appTheme.findMany({
      select: { id: true },
      where: { userId: loggedInUserId },
    })
  ).map((theme) => theme.id);

  // ユーザーの開発情報のidを取得する
  const developerIds = (
    await db.appThemeDeveloper.findMany({
      select: { id: true },
      where: { userId: loggedInUserId },
    })
  ).map((dev) => dev.id);

  // ユーザーが投稿したお題に貰ったいいねの数
  const themeLikes = await db.appThemeLike.count({
    where: { appThemeId: { in: themeIds } },
  });

  // ユーザーの開発情報に貰ったいいねの数
  const developLikes = await db.appThemeDeveloperLike.count({
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
