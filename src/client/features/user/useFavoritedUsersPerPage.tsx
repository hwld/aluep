import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "./useUserQuery";

export const favoritedUsersPerPageQueryKey = (
  favoriteUserId: string,
  page: number
) =>
  [
    ...userQueryKey(favoriteUserId),
    "favoriteUserId",
    { page: isNaN(page) ? 1 : page },
  ] as const;

export const useFavoritedUsersPerPage = (userId: string, page: number) => {
  const { data: favoritedUsersPerPage, ...others } = useQuery({
    queryKey: favoritedUsersPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.user.getFavoritedUsers.query({
        favoriteByUserId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { favoritedUsersPerPage, ...others };
};
