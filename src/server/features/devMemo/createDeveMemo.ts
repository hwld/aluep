import { createDevMemoInputSchema } from "@/models/devMemo";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const createDevMemo = requireLoggedInProcedure
  .input(createDevMemoInputSchema)
  .mutation(async () => {
    // TODO
    // const dev = await db.development.findUnique({
    //   where: { id: input.devId },
    // });
    // if (!dev) {
    //   throw new TRPCError({ code: "NOT_FOUND" });
    // }
    // const isOtherUser = dev.userId !== ctx.session.user.id;
    // if (!dev.allowOtherUserMemos && isOtherUser) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // // 他のユーザーは返信しかできない
    // if (isOtherUser && input.parentMemoId === undefined) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // const createdMemo = await db.developmentMemo.create({
    //   data: {
    //     developmentId: input.devId,
    //     text: input.text,
    //     fromUserId: ctx.session.user.id,
    //     parentMemoId: input.parentMemoId,
    //   },
    // });
    // return { memoId: createdMemo.id };
  });
