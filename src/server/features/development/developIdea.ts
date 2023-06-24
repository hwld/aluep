import { DevelopmentStatusIds } from "../../../share/consts";
import { createDevelopmentInputSchema } from "../../../share/schema/development";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createOrExtractGithubRepositoryUrl } from "./utils";

export const developIdea = requireLoggedInProcedure
  .input(createDevelopmentInputSchema)
  .mutation(async ({ input, ctx }) => {
    const githubRepositoryUrl = await createOrExtractGithubRepositoryUrl(
      input,
      ctx.session.user.id
    );
    const developmentStatusId =
      input.type === "referenceRepository"
        ? input.developmentStatusId
        : DevelopmentStatusIds.IN_PROGRESS;

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
