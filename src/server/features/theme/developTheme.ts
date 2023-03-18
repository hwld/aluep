import { TRPCError } from "@trpc/server";
import { GitHubErrors } from "../../../share/errors";
import { themeDevelopFormSchema } from "../../../share/schema";
import { assertNever } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createGitHubRepository } from "../github/createGitHubRepository";

export const developTheme = requireLoggedInProcedure
  .input(themeDevelopFormSchema)
  .mutation(async ({ input, ctx }) => {
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
