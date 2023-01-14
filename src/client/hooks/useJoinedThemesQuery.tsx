import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { userQueryKey } from "./useUserQuery";

export const joinedThemesQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "joined-themes",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが参加しているお題一覧を取得する */
export const useJoinedThemesQuery = (userId: string, page: number) => {
  const { data: joinedThemes, ...others } = useQuery({
    queryKey: joinedThemesQueryKey(userId, page),
    queryFn: () => {
      return trpc.user.getJoinTheme.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { joinedThemes, ...others };
};
