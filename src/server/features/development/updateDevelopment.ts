import { updateDevelopmentInputSchema } from "@/models/development";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";

export const updateDevelopment = requireLoggedInProcedure
  .input(updateDevelopmentInputSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const development = await db.development.findFirst({
      where: {
        id: input.developmentId,
        ideaId: input.ideaId,
        userId: ctx.session.user.id,
      },
    });
    if (!development) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.development.update({
      where: { id: development.id },
      data: {
        githubUrl: input.githubRepositoryUrl,
        comment: input.comment,
        developedItemUrl: input.developedItemUrl,
        statusId: input.developmentStatusId,
      },
    });
  });
