import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const joinThemesQueryKey = (userId: string) => ["joinThemes", userId];
export const useJoinThemesQuery = (userId: string) => {
  const { data: joinThemes, ...others } = useQuery({
    queryKey: joinThemesQueryKey(userId),
    queryFn: () => {
      return trpc.user.getJoinTheme.query({ userId: userId });
    },
    keepPreviousData: true,
  });

  return { joinThemes, ...others };
};
