import { TRPCError } from "@trpc/server";
import { developmentMemoFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const createDevelopmentMemo = requireLoggedInProcedure
  .input(developmentMemoFormSchema)
  .mutation(async ({ input, ctx }) => {
    const development = await db.development.findUnique({
      where: { id: input.developmentId },
    });

    if (!development) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (
      !development.allowOtherUserMemos &&
      development.userId !== ctx.session.user.id
    ) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // TODO: 他のユーザーは返信しかできないようにする

    const createdMemo = await db.developmentMemo.create({
      data: {
        developmentId: input.developmentId,
        memo: input.memo,
        fromUserId: ctx.session.user.id,
        parentMemoId: input.parentMemoId,
      },
    });

    return { memoId: createdMemo.id };
  });
