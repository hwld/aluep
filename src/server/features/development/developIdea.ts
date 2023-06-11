import { DevelopmentStatusIds } from "../../../share/consts";
import { developmentFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { createOrExtractGithubRepositoryUrl } from "./utils";

export const developIdea = requireLoggedInProcedure
  .input(developmentFormSchema)
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
        status: { connect: { id: developmentStatusId } },
      },
    });

    return { developmentId: development.id };
  });
