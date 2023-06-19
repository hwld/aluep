import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

/** 指定されたユーザーがお気に入り登録したユーザーを取得する */
export const useFavoritedUsersPerPage = (userId: string, page: number) => {
  const { data: favoritedUsersPerPage, ...others } = useQuery({
    queryKey: userKeys.favoritedList(userId, page),
    queryFn: () => {
      return trpc.user.getFavoritedUsers.query({
        favoriteByUserId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { favoritedUsersPerPage, ...others };
};
