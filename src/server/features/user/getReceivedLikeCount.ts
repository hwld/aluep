import { z } from "zod";
import { ReceivedLikeCount } from "../../../client/features/user/useReceivedLikeCountQuery";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getReceivedLikeCount = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<ReceivedLikeCount> => {
    // お題の投稿者としてもらったいいねの数
    const postedIdeaIds = await db.idea.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });

    const ideaLikeCount = await db.ideaLike.count({
      where: { ideaId: { in: postedIdeaIds.map((i) => i.id) } },
    });

    // お題の開発者としてもらったいいねの数
    const developmentIds = await db.development.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });

    const developmentLikeCount = await db.developmentLike.count({
      where: { developmentId: { in: developmentIds.map((i) => i.id) } },
    });

    return { ideaLikeCount, developmentLikeCount };
  });
