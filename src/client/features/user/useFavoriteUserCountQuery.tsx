import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const favoriteUserCountQueryKey = (userId: string) =>
  ["users", userId, "favoriteUserCount"] as const;

export const useFavoriteUserCountQuery = (userId: string) => {
  const { data: favoriteUserCount, ...others } = useQuery({
    queryKey: favoriteUserCountQueryKey(userId),
    queryFn: () => {
      return trpc.user.getFavoriteCountByUser.query({ userId });
    },
  });

  return { favoriteUserCount, ...others };
};
