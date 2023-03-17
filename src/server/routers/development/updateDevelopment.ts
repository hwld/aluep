import { TRPCError } from "@trpc/server";
import { GitHubErrors } from "../../../share/errors";
import { updateThemeDevelopFormSchema } from "../../../share/schema";
import { assertNever } from "../../../share/utils";
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
      const createResult = await createGitHubRepository({
        repositoryName: input.githubRepositoryName,
        repositoryDescription: input.githubRepositoryDescription ?? "",
        userId: ctx.session.user.id,
      });

      if (!createResult.success) {
        switch (createResult.error) {
          case "UNAUTHORIZED":
            throw new TRPCError({ code: "UNAUTHORIZED" });
          case "NAME_ALREADY_EXISTS":
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: GitHubErrors.NAME_ALREADY_EXISTS,
            });
          case "SERVER_ERROR":
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          default:
            assertNever(createResult.error);
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      githubRepositoryUrl = createResult.githubRepositoryUrl;
    } else if (input.type === "referenceRepository") {
      githubRepositoryUrl = input.githubRepositoryUrl;
    }

    await db.appThemeDevelopment.update({
      where: { id: development.id },
      data: { githubUrl: githubRepositoryUrl, comment: input.comment },
    });
  });
