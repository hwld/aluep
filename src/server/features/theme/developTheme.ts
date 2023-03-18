import { themeDevelopFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createGitHubRepository } from "../github/createGitHubRepository";

export const developTheme = requireLoggedInProcedure
  .input(themeDevelopFormSchema)
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
    await db.appThemeDevelopment.create({
      data: {
        appTheme: { connect: { id: input.themeId } },
        user: { connect: { id: ctx.session.user.id } },
        githubUrl: githubRepositoryUrl,
        comment: input.comment ?? "",
      },
    });
  });
