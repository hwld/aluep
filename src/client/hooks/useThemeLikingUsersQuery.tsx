import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { themesQueryKey } from "./usePaginatedThemesQuery";

export const themeLikingUsersQueryKey = (themeId: string, page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...themesQueryKey, themeId, "liking-users", { page: p }] as const;
};

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useThemeLikingUsersQuery = (themeId: string, page: number) => {
  const result = useQuery({
    queryKey: themeLikingUsersQueryKey(themeId, page),
    queryFn: () => {
      return trpc.theme.getThemeLikingUsers.query({
        themeId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return result;
};
