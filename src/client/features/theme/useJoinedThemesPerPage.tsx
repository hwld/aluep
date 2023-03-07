import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const joinedThemesPerPageQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "joined-themes",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが参加しているお題一覧を取得する */
export const useJoinedThemesPerPage = (userId: string, page: number) => {
  const { data: joinedThemesPerPage, ...others } = useQuery({
    queryKey: joinedThemesPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.theme.getJoinedThemesByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { joinedThemesPerPage, ...others };
};
