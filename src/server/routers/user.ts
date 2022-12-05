import { z } from "zod";
import { findManyThemes } from "../models/theme";
import { prisma } from "../prismadb";
import { publicProcedure, router } from "../trpc";

export const userRoute = router({
  //すべてのテーマからthemeのidがユーザidのthemeを取り出す
  getPostTheme: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const postThemes = await findManyThemes({
        where: { userId: input.userId },
      });
      return postThemes;
    }),

  getJoinTheme: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      //
      const joinTheme = await prisma.appThemeDeveloper.findMany({
        where: { userId: input.userId },
      });
      const joinThemeList = joinTheme.map((theme) => theme.appThemeId);
      const joinPostedTheme = await findManyThemes({
        where: { id: { in: joinThemeList } },
      });

      return joinPostedTheme;
    }),

  getThemeLike: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      //whereで条件に一致するidを取得
      const postThemeIds = await prisma.appTheme.findMany({
        select: { id: true },
        where: { userId: input.userId },
      });
      const ids = postThemeIds.map((like) => like.id);
      const likes = await prisma.appThemeLike.count({
        where: { appThemeId: { in: ids } },
      });
      return likes;
    }),

  getThemeDeveloperLike: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const postThemeIds = await prisma.appThemeDeveloper.findMany({
        select: { userId: true },
        where: { userId: input.userId },
      });
      const ids = postThemeIds.map((like) => like.userId);
      const likes = await prisma.appThemeDeveloperLike.count({
        where: { developerId: { in: ids } },
      });
      return likes;
    }),
});
