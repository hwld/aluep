import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const favoriteUsersCountQueryKey = (userId: string) =>
  ["users", userId, "favoriteUsersCount"] as const;

export const useFavoriteUsersCountQuery = (userId: string) => {
  const { data: favoriteUsersCount, ...others } = useQuery({
    queryKey: favoriteUsersCountQueryKey(userId),
    queryFn: () => {
      return trpc.user.favoriteUsersCount.query({ userId });
    },
  });

  return { favoriteUsersCount, ...others };
};
