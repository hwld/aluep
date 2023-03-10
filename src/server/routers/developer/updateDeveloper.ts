import { TRPCError } from "@trpc/server";
import { themeJoinFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const updateDeveloper = requireLoggedInProcedure
  .input(themeJoinFormSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const developer = await db.appThemeDeveloper.findFirst({
      where: { appThemeId: input.themeId, userId: ctx.session.user.id },
    });
    if (!developer) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.appThemeDeveloper.update({
      where: { id: developer.id },
      data: { githubUrl: input.githubUrl, comment: input.comment },
    });
  });
