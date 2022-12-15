import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const likeThemesQueryKey = ["likeThemes"];
export const useLikeThemesQuery = (userId: string) => {
  const { data: likeThemes, ...others } = useQuery({
    queryKey: likeThemesQueryKey,
    queryFn: () => {
      return trpc.user.getLikeTheme.query({ userId: userId });
    },
  });

  return { likeThemes, ...others };
};
