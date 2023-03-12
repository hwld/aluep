import { TRPCError } from "@trpc/server";
import { themeJoinFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const updateDevelopment = requireLoggedInProcedure
  .input(themeJoinFormSchema)
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const development = await db.appThemeDevelopment.findFirst({
      where: { appThemeId: input.themeId, userId: ctx.session.user.id },
    });
    if (!development) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.appThemeDevelopment.update({
      where: { id: development.id },
      data: { githubUrl: input.githubUrl, comment: input.comment },
    });
  });
