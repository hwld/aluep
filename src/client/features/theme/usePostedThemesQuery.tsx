import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const postedThemesPerPageQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "posted-themes",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedThemesPerPageQuery = (userId: string, page: number) => {
  const { data: postedThemesPerPage, ...others } = useQuery({
    queryKey: postedThemesPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.theme.getPostedThemesByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { postedThemesPerPage, ...others };
};
