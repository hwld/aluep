import { userKeys } from "@/client/features/user/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseFavoritedUsersArgs = { userId: string; page: number };

/** 指定されたユーザーがお気に入り登録したユーザーを取得する */
export const useFavoritedUsers = ({ userId, page }: UseFavoritedUsersArgs) => {
  const { data: favoritedUsers, ...others } = useQuery({
    queryKey: userKeys.favoritedList(userId, page),
    queryFn: () => {
      return trpc.user.getFavoritedUsers.query({
        favoriteByUserId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { favoritedUsers, ...others };
};
