import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const getMySummary = requireLoggedInProcedure.query(async () => {
  // TODO:
  // const loggedInUserId = ctx.session.user.id;
  // // ユーザーが投稿したお題のidを取得する
  // const ideaIds = (
  //   await db.idea.findMany({
  //     select: { id: true },
  //     where: { userId: loggedInUserId },
  //   })
  // ).map((idea) => idea.id);

  // // ユーザーの開発情報のidを取得する
  // const devIds = (
  //   await db.development.findMany({
  //     select: { id: true },
  //     where: { userId: loggedInUserId },
  //   })
  // ).map((dev) => dev.id);

  // // ユーザーが投稿したお題に貰ったいいねの数
  // const ideaLikes = await db.ideaLike.count({
  //   where: { ideaId: { in: ideaIds } },
  // });

  // // ユーザーの開発情報に貰ったいいねの数
  // const developLikes = await db.developmentLike.count({
  //   where: { developmentId: { in: devIds } },
  // });

  // return {
  //   // ユーザーが投稿したお題の数
  //   ideas: ideaIds.length,
  //   // ユーザーが開発したお題の数
  //   devs: devIds.length,
  //   // ユーザーが貰ったすべてのいいねの数
  //   allLikes: ideaLikes + developLikes,
  // };
  return {
    ideas: 0,
    devs: 0,
    allLikes: 0,
  };
});
