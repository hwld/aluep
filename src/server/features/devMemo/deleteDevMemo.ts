import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const deleteDevMemo = requireLoggedInProcedure
  .input(z.object({ devMemoId: z.string() }))
  .mutation(async () => {
    // const memo = await db.developmentMemo.findUnique({
    //   where: { id: input.devMemoId },
    // });
    // if (memo?.fromUserId !== ctx.session.user.id) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // const deletedMemo = await db.developmentMemo.delete({
    //   where: { id: input.devMemoId },
    // });
    // return deletedMemo;
  });
