import { TRPCError } from "@trpc/server";
import { updateThemeDevelopFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createGitHubRepository } from "../github/createGitHubRepository";

export const updateDevelopment = requireLoggedInProcedure
  .input(updateThemeDevelopFormSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const development = await db.appThemeDevelopment.findFirst({
      where: {
        id: input.developmentId,
        appThemeId: input.themeId,
        userId: ctx.session.user.id,
      },
    });
    if (!development) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

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

    await db.appThemeDevelopment.update({
      where: { id: development.id },
      data: { githubUrl: githubRepositoryUrl, comment: input.comment },
    });
  });
