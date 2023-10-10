import { createDevelopmentInputSchema } from "@/models/development";
import { DevStatusIds } from "@/models/developmentStatus";
import { createOrExtractGithubRepositoryUrl } from "@/server/features/development/utils";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const createDevelopment = requireLoggedInProcedure
  .input(createDevelopmentInputSchema)
  .mutation(async ({ input, ctx }) => {
    const githubRepositoryUrl = await createOrExtractGithubRepositoryUrl(
      input,
      ctx.session.user.id
    );
    const developmentStatusId =
      input.type === "referenceRepository"
        ? input.developmentStatusId
        : DevStatusIds.IN_PROGRESS;

    // 開発情報を登録する
    const development = await db.development.create({
      data: {
        idea: { connect: { id: input.ideaId } },
        user: { connect: { id: ctx.session.user.id } },
        githubUrl: githubRepositoryUrl,
        comment: input.comment ?? "",
        developedItemUrl: input.developedItemUrl ?? "",
        status: { connect: { id: developmentStatusId } },
      },
    });

    return { developmentId: development.id };
  });
