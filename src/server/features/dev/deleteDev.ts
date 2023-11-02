import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const deleteDev = requireLoggedInProcedure
  .input(z.object({ devId: z.string() }))
  .mutation(async () => {
    // ログインユーザーが開発者か確認する
    // const dev = await db.development.findFirst({
    //   where: { id: input.devId, userId: ctx.session.user.id },
    // });
    // if (!dev) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // const deleted = await db.development.delete({
    //   where: { id: input.devId },
    // });
    // return deleted;
  });
