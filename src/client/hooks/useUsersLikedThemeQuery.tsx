import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const usersLikedThemeQueryKey = (themeId: string) => [
  "users",
  themeId,
  "likes",
];

/**
 * 指定されたお題をいいねしたユーザーを返す
 * @param themeId
 * @returns
 */
export const useUsersLikedThemeQuery = (themeId: string) => {
  const { data: users, ...others } = useQuery({
    queryKey: usersLikedThemeQueryKey(themeId),
    queryFn: () => {
      return trpc.theme.getLikedUsers.query({ themeId });
    },
    initialData: [],
  });

  return { users, ...others };
};
