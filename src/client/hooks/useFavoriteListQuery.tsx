import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const favoriteListQueryKey = (favoriteUserId: string) => [
  "favoriteUserId",
  favoriteUserId,
];

export const useFavoriteListQuery = (userId: string) => {
  const { data: favoriteList, ...others } = useQuery({
    queryKey: favoriteListQueryKey(userId),
    queryFn: () => {
      return trpc.user.favoriteList.query({
        favoriteUserId: userId,
      });
    },
  });
  return { favoriteList, ...others };
};
