import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { userQueryKey } from "./useUserQuery";

export const likedThemesQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "liked-themes",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが良いねしたお題を取得する */
export const useLikedThemesQuery = (userId: string, page: number) => {
  const { data: likedThemes, ...others } = useQuery({
    queryKey: likedThemesQueryKey(userId, page),
    queryFn: () => {
      return trpc.user.getLikeTheme.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedThemes, ...others };
};
