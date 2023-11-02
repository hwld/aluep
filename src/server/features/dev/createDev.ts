import { createDevInputSchema } from "@/models/dev";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const createDev = requireLoggedInProcedure
  .input(createDevInputSchema)
  .mutation(async () => {
    // 開発情報を登録する
    // TODO
    // const dev = await db.development.create({
    //   data: {
    //     idea: { connect: { id: input.ideaId } },
    //     user: { connect: { id: ctx.session.user.id } },
    //     githubUrl: input.githubRepositoryUrl,
    //     comment: input.comment ?? "",
    //     developedItemUrl: input.developedItemUrl ?? "",
    //     status: input.status,
    //   },
    // });

    // return { devId: dev.id };
    return { devId: "" };
  });
