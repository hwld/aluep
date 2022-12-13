import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themeLikesQueryKey = ["themeLikes"];
export const useThemeLikesQuery = (userId: string) => {
  const { data: themeLikes, ...others } = useQuery({
    queryKey: themeLikesQueryKey,
    queryFn: () => {
      return trpc.user.getThemeLike.query({ userId: userId });
    },
  });

  return { themeLikes, ...others };
};
