import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const likeThemesQueryKey = (userId: string) => ["likeThemes", userId];

/** ユーザーが良いねしたお題を取得する */
export const useLikeThemesQuery = (userId: string) => {
  const { data: likeThemes, ...others } = useQuery({
    queryKey: likeThemesQueryKey(userId),
    queryFn: () => {
      return trpc.user.getLikeTheme.query({ userId: userId });
    },
    keepPreviousData: true,
  });

  return { likeThemes, ...others };
};
