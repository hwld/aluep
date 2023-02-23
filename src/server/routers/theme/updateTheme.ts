import { TRPCError } from "@trpc/server";
import sanitize from "sanitize-html";
import { themeUpdateFormSchema } from "../../../share/schema";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";
import { themeDescriptionSanitizeOptions } from "./themeDescriptionSanitizeOptions";

export const updateTheme = requireLoggedInProcedure
  .input(themeUpdateFormSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが投稿したお題が存在するか確認する
    const existingTheme = await prisma.appTheme.findFirst({
      where: { id: input.themeId, userId: ctx.session.user.id },
    });
    if (!existingTheme) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // 更新前のタグを全部外す
    const deleteAllTags = prisma.appThemeTagOnAppTheme.deleteMany({
      where: { themeId: input.themeId },
    });

    // htmlをサニタイズする
    const sanitizedThemeDescriptionHtml = sanitize(
      input.descriptionHtml,
      themeDescriptionSanitizeOptions
    );

    // 入力されたタグを全て付ける
    const attachTags = prisma.appTheme.update({
      where: { id: input.themeId },
      data: {
        title: input.title,
        description: sanitizedThemeDescriptionHtml,
        tags: { create: input.tags.map((tagId) => ({ tagId })) },
      },
    });

    // トランザクションを使用する
    await prisma.$transaction([deleteAllTags, attachTags]);
  });
