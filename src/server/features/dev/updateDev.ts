import { updateDevInputSchema } from "@/models/dev";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";

export const updateDev = requireLoggedInProcedure
  .input(updateDevInputSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const dev = await db.development.findFirst({
      where: {
        id: input.devId,
        userId: ctx.session.user.id,
      },
    });
    if (!dev) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.development.update({
      where: { id: dev.id },
      data: {
        githubUrl: input.githubRepositoryUrl,
        comment: input.comment,
        developedItemUrl: input.developedItemUrl,
        status: input.status,
      },
    });
  });
