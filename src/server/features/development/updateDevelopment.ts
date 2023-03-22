import { TRPCError } from "@trpc/server";
import { updateDevelopFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createGitHubRepository } from "../github/createGitHubRepository";

export const updateDevelopment = requireLoggedInProcedure
  .input(updateDevelopFormSchema)
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

    await db.development.update({
      where: { id: development.id },
      data: { githubUrl: githubRepositoryUrl, comment: input.comment },
    });
  });
