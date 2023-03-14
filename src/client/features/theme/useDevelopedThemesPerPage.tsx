import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const developedThemesPerPageQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "developed-themes",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが開発しているお題一覧を取得する */
export const useDevelopedThemesPerPage = (userId: string, page: number) => {
  const { data: developedThemesPerPage, ...others } = useQuery({
    queryKey: developedThemesPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.theme.getDevelopedThemesByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { developedThemesPerPage, ...others };
};
