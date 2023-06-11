import { z } from "zod";
import { UserActivity } from "../../../client/features/user/useUserActivityQuery";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getUserActivity = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<UserActivity> => {
    // 指定されたユーザーが投稿したお題の数
    const postedIdeaCount = await db.idea.count({
      where: { userId: input.userId },
    });

    // 指定されたユーザーが開発したお題の数
    const developmentCount = await db.development.count({
      where: { userId: input.userId },
    });

    // 指定されたユーザーがいいねしたお題の数
    const likedIdeaCount = await db.ideaLike.count({
      where: { userId: input.userId },
    });

    return {
      postedIdeaCount,
      developmentCount,
      likedIdeaCount,
    };
  });
