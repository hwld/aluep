import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const postThemeQueryKey = (userId: string) => ["user", userId];
export const usePostThemesQuery = (userId: string) => {
  const { data: postThemes, ...others } = useQuery({
    queryKey: postThemeQueryKey(userId),
    queryFn: () => {
      return trpc.user.getPostTheme.query({ userId: userId });
    },
  });

  return { postThemes, ...others };
};
