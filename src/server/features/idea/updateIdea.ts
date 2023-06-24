import { TRPCError } from "@trpc/server";
import sanitize from "sanitize-html";
import { ideaUpdateFormSchema } from "../../../share/schema/idea";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { ideaDescriptionSanitizeOptions } from "./ideaDescriptionSanitizeOptions";

export const updateIdea = requireLoggedInProcedure
  .input(ideaUpdateFormSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが投稿したお題が存在するか確認する
    const existingIdea = await db.idea.findFirst({
      where: { id: input.ideaId, userId: ctx.session.user.id },
    });
    if (!existingIdea) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // 更新前のタグを全部外す
    const deleteAllTags = db.ideaTagOnIdea.deleteMany({
      where: { ideaId: input.ideaId },
    });

    // htmlをサニタイズする
    const sanitizedIdeaDescriptionHtml = sanitize(
      input.descriptionHtml,
      ideaDescriptionSanitizeOptions
    );

    // 入力されたタグを全て付ける
    const attachTags = db.idea.update({
      where: { id: input.ideaId },
      data: {
        title: input.title,
        description: sanitizedIdeaDescriptionHtml,
        tags: { create: input.tags.map((tagId) => ({ tagId })) },
      },
    });

    // トランザクションを使用する
    await db.$transaction([deleteAllTags, attachTags]);
  });
