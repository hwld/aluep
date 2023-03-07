import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "./useUserQuery";

export const favoritedUsersQueryKey = (favoriteUserId: string, page: number) =>
  [
    ...userQueryKey(favoriteUserId),
    "favoriteUserId",
    { page: isNaN(page) ? 1 : page },
  ] as const;

export const useFavoritedUsersQuery = (userId: string, page: number) => {
  // TODO: allPagesを含むオブジェクト全部に言えるけど、変数名どうしたらいいんだろうなぁ・・・
  const { data: favoritedUsersPerPage, ...others } = useQuery({
    queryKey: favoritedUsersQueryKey(userId, page),
    queryFn: () => {
      return trpc.user.favoritedUsers.query({
        favoriteByUserId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { favoritedUsersPerPage, ...others };
};
