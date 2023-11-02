import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const likeIdea = requireLoggedInProcedure
  .input(z.object({ ideaId: z.string().min(1) }))
  .mutation(async () => {
    // const idea = await db.idea.findUnique({
    //   where: { id: input.ideaId },
    // });
    // // 指定されたideaが存在しない場合
    // if (!idea) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // // 投稿者が自分のお題にいいねすることはできない
    // if (idea.userId == ctx.session.user.id) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // // いいね
    // const createdLike = await db.ideaLike.create({
    //   data: {
    //     idea: { connect: { id: idea.id } },
    //     user: { connect: { id: ctx.session.user.id } },
    //   },
    // });
    // return { ideaId: createdLike.ideaId };
  });
