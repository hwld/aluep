import { updateDevInputSchema } from "@/models/dev";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const updateDev = requireLoggedInProcedure
  .input(updateDevInputSchema)
  .mutation(async () => {
    // ログインユーザーが開発者か確認する
    // TODO
    // const dev = await db.development.findFirst({
    //   where: {
    //     id: input.devId,
    //     userId: ctx.session.user.id,
    //   },
    // });
    // if (!dev) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // await db.development.update({
    //   where: { id: dev.id },
    //   data: {
    //     githubUrl: input.githubRepositoryUrl,
    //     comment: input.comment,
    //     developedItemUrl: input.developedItemUrl,
    //     status: input.status,
    //   },
    // });
  });
