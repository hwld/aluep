import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { UserAndIdeaLikes } from "../../models/user";

export const getTop10LikesPostersInThisMonth = publicProcedure.query(
  async () => {
    const posterUsers: UserAndIdeaLikes[] = await db.$transaction(
      async (tx) => {
        type RawPosterUser = { userId: string; likeCount: BigInt }[];
        // このクエリが原因?
        const rawPosterUser = await tx.$queryRaw<RawPosterUser>`
        SELECT
          User.id as userId
          , COUNT(IdeaLike.id) as likeCount
          , MIN(Idea.createdAt) as firstPostDatetime
        FROM
          IdeaLike as IdeaLike
          LEFT JOIN Idea as Idea
            ON (IdeaLike.ideaId = Idea.id)
          LEFT JOIN User
            ON (Idea.userId = User.id)
        WHERE
          IdeaLike.createdAt > (NOW() - INTERVAL 1 MONTH)
        GROUP BY
          User.id
        ORDER BY
          likeCount DESC
          , firstPostDatetime ASC
        LIMIT
          10
      `;

        const posterUserIds = rawPosterUser.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: posterUserIds } },
        });

        // posterUserIdsはランキング順通りになっているが、prismaでinを通すと順番が不定になるので
        // posterUseridsの順に並び変える
        const sortedUsers = sortedInSameOrder({
          target: users,
          base: posterUserIds,
          getKey: (t) => t.id,
        });

        const usersAndIdeaLikes = sortedUsers.map(
          (user, i): UserAndIdeaLikes => ({
            ...user,
            ideaLikes: Number(rawPosterUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndIdeaLikes;
      }
    );

    return posterUsers;
  }
);
