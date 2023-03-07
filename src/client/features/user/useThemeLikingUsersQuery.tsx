import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { themesQueryKey } from "../theme/useThemeQuery";

export const themeLikingUsersPerPageQueryKey = (
  themeId: string,
  page: number
) => {
  const p = isNaN(page) ? 1 : page;
  return [...themesQueryKey, themeId, "liking-users", { page: p }] as const;
};

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useThemeLikingUsersPerPage = (themeId: string, page: number) => {
  const { data: themeLikingUsersPerPage, ...others } = useQuery({
    queryKey: themeLikingUsersPerPageQueryKey(themeId, page),
    queryFn: () => {
      return trpc.user.getThemeLikingUsers.query({
        themeId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { themeLikingUsersPerPage, ...others };
};
