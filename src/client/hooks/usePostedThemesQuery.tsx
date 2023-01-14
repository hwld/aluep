import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { userQueryKey } from "./useUserQuery";

export const postedThemesQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "posted-themes",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedThemesQuery = (userId: string, page: number) => {
  const { data: postedThemes, ...others } = useQuery({
    queryKey: postedThemesQueryKey(userId, page),
    queryFn: () => {
      return trpc.user.getPostTheme.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { postedThemes, ...others };
};
