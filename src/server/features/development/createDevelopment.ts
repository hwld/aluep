import { createDevelopmentInputSchema } from "@/models/development";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const createDevelopment = requireLoggedInProcedure
  .input(createDevelopmentInputSchema)
  .mutation(async ({ input, ctx }) => {
    // 開発情報を登録する
    const development = await db.development.create({
      data: {
        idea: { connect: { id: input.ideaId } },
        user: { connect: { id: ctx.session.user.id } },
        githubUrl: input.githubRepositoryUrl,
        comment: input.comment ?? "",
        developedItemUrl: input.developedItemUrl ?? "",
        status: { connect: { id: input.developmentStatusId } },
      },
    });

    return { developmentId: development.id };
  });
