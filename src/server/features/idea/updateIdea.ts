import { ideaDescriptionSanitizeOptions } from "@/server/features/idea/ideaDescriptionSanitizeOptions";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { updateIdeaInputSchema } from "@/share/schema/idea";
import { TRPCError } from "@trpc/server";
import sanitize from "sanitize-html";

export const updateIdea = requireLoggedInProcedure
  .input(updateIdeaInputSchema)
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
