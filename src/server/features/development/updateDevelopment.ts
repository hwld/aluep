import { updateDevelopmentInputSchema } from "@/models/development";
import { DevStatusIds } from "@/models/developmentStatus";
import { createOrExtractGithubRepositoryUrl } from "@/server/features/development/utils";
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

    const githubRepositoryUrl = await createOrExtractGithubRepositoryUrl(
      input,
      ctx.session.user.id
    );
    const developmentStatusId =
      input.type === "referenceRepository"
        ? input.developmentStatusId
        : DevStatusIds.IN_PROGRESS;

    await db.development.update({
      where: { id: development.id },
      data: {
        githubUrl: githubRepositoryUrl,
        comment: input.comment,
        developedItemUrl: input.developedItemUrl,
        statusId: developmentStatusId,
      },
    });
  });
