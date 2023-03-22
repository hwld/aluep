import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const getMySummary = requireLoggedInProcedure.query(async ({ ctx }) => {
  const loggedInUserId = ctx.session.user.id;

  // ユーザーが投稿したお題のidを取得する
  const ideaIds = (
    await db.idea.findMany({
      select: { id: true },
      where: { userId: loggedInUserId },
    })
  ).map((idea) => idea.id);

  // ユーザーの開発情報のidを取得する
  const developmentIds = (
    await db.development.findMany({
      select: { id: true },
      where: { userId: loggedInUserId },
    })
  ).map((dev) => dev.id);

  // ユーザーが投稿したお題に貰ったいいねの数
  const ideaLikes = await db.ideaLike.count({
    where: { ideaId: { in: ideaIds } },
  });

  // ユーザーの開発情報に貰ったいいねの数
  const developLikes = await db.developmentLike.count({
    where: { developmentId: { in: developmentIds } },
  });

  return {
    // ユーザーが投稿したお題の数
    ideas: ideaIds.length,
    // ユーザーが開発したお題の数
    developments: developmentIds.length,
    // ユーザーが貰ったすべてのいいねの数
    allLikes: ideaLikes + developLikes,
  };
});
