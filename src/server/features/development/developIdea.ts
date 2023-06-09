import { DevelopmentStatuses } from "../../../share/consts";
import { developFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createGitHubRepository } from "../github/createGitHubRepository";

export const developIdea = requireLoggedInProcedure
  .input(developFormSchema)
  .mutation(async ({ input, ctx }) => {
    let githubRepositoryUrl = "";

    if (input.type === "createRepository") {
      githubRepositoryUrl = await createGitHubRepository({
        repositoryName: input.githubRepositoryName,
        repositoryDescription: input.githubRepositoryDescription ?? "",
        userId: ctx.session.user.id,
      });
    } else if (input.type === "referenceRepository") {
      githubRepositoryUrl = input.githubRepositoryUrl;
    }

    // 開発情報を登録する
    const development = await db.development.create({
      data: {
        idea: { connect: { id: input.ideaId } },
        user: { connect: { id: ctx.session.user.id } },
        githubUrl: githubRepositoryUrl,
        comment: input.comment ?? "",
        status: { connect: { id: DevelopmentStatuses.IN_PROGRESS } },
      },
    });

    return { developmentId: development.id };
  });
