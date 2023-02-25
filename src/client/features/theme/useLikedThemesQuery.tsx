import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

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
      return trpc.theme.getLikedThemesByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedThemes, ...others };
};
