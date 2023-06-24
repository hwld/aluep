import { TRPCError } from "@trpc/server";
import { DevelopmentStatusIds } from "../../../share/consts";
import { updateDevelopFormSchema } from "../../../share/schema/development";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createOrExtractGithubRepositoryUrl } from "./utils";

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

    const githubRepositoryUrl = await createOrExtractGithubRepositoryUrl(
      input,
      ctx.session.user.id
    );
    const developmentStatusId =
      input.type === "referenceRepository"
        ? input.developmentStatusId
        : DevelopmentStatusIds.IN_PROGRESS;

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
