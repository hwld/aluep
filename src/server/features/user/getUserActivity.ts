import { UserActivity } from "@/client/features/user/useUserActivityQuery";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getUserActivity = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async (): Promise<UserActivity> => {
    // // 指定されたユーザーが投稿したお題の数
    // const postedIdeaCount = await db.idea.count({
    //   where: { userId: input.userId },
    // });
    // // 指定されたユーザーが開発したお題の数
    // const devCount = await db.development.count({
    //   where: { userId: input.userId },
    // });
    // // 指定されたユーザーがいいねしたお題の数
    // const likedIdeaCount = await db.ideaLike.count({
    //   where: { userId: input.userId },
    // });
    // return {
    //   postedIdeaCount,
    //   devCount,
    //   likedIdeaCount,
    // };

    return { devCount: 0, likedIdeaCount: 0, postedIdeaCount: 0 };
  });
