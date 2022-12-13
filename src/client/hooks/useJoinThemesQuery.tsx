import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const joinThemesQueryKey = ["joinThemes"];
export const useJoinThemesQuery = (userId: string) => {
  const { data: joinThemes, ...others } = useQuery({
    queryKey: joinThemesQueryKey,
    queryFn: () => {
      return trpc.user.getJoinTheme.query({ userId: userId });
    },
  });

  return { joinThemes, ...others };
};
