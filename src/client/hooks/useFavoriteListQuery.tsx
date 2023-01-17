import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { userQueryKey } from "./useUserQuery";

export const favoriteListQueryKey = (favoriteUserId: string, page: number) =>
  [
    ...userQueryKey(favoriteUserId),
    "favoriteUserId",
    { page: isNaN(page) ? 1 : page },
  ] as const;

export const useFavoriteListQuery = (userId: string, page: number) => {
  const { data: favoriteList, ...others } = useQuery({
    queryKey: favoriteListQueryKey(userId, page),
    queryFn: () => {
      return trpc.user.favoriteList.query({
        favoriteUserId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { favoriteList, ...others };
};
