import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { favoriteSumQueryKey } from "./useFavoriteUser";

export const favoriteAnotherSumQueryKey = (userId: string) => [
  "favoriteUserId",
  userId,
];

export const useFavoriteAnother = (userId: string) => {
  const { data: favoritedAnotherSum } = useQuery({
    queryKey: favoriteSumQueryKey(userId),
    queryFn: () => {
      return trpc.user.favoritedAnotherSum.query({ userId });
    },
  });

  return favoritedAnotherSum;
};
