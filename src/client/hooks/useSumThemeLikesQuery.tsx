import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const sumThemeLikesQueryKey = (userId: string) => [
  userId,
  "sumThemeLikes",
];
export const useSumThemeLikesQuery = (userId: string) => {
  const { data: sumThemeLikes, ...others } = useQuery({
    queryKey: sumThemeLikesQueryKey(userId),
    queryFn: () => {
      return trpc.user.getThemeLike.query({ userId: userId });
    },
  });
  return { sumThemeLikes, ...others };
};
