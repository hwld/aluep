import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getThemeLikingUsers = publicProcedure
  .input(z.object({ themeId: z.string(), page: pageSchema }))
  .query(async ({ input }) => {
    const { data: use, allPages } = await paginate({
      finder: prisma.appThemeLike.findMany,
      finderInput: {
        where: { appThemeId: input.themeId },
        orderBy: { createdAt: "desc" as const },
      },
      counter: prisma.appThemeLike.count,
      pagingData: { page: input.page, limit: 20 },
    });

    const userIds = use.map(({ userId }) => userId);

    //ユーザーの情報を取得する
    const usered = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    //userIdsに並び順を合わせる
    const sortusers = usered.sort((a, b) => {
      return userIds.indexOf(a.id) - userIds.indexOf(b.id);
    });

    //usersにceratedAt(いいねをした日)をつける
    const users = sortusers.map((user, i) => ({
      ...user,
      themeLikeCreated: new Date(use[i]?.createdAt) ?? 0,
    }));

    return { users, allPages };
  });
