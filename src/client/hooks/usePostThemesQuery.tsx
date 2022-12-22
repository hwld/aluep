import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { themesQueryKey } from "./usePaginatedThemesQuery";

export const postThemeQueryKey = (userId: string) => [
  ...themesQueryKey,
  userId,
];
export const usePostThemesQuery = (userId: string) => {
  const { data: postThemes, ...others } = useQuery({
    queryKey: postThemeQueryKey(userId),
    queryFn: () => {
      return trpc.user.getPostTheme.query({ userId: userId });
    },
    keepPreviousData: true,
  });

  return { postThemes, ...others };
};
