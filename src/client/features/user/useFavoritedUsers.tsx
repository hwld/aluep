import { trpc } from "@/client/lib/trpc";

type UseFavoritedUsersArgs = { userId: string; page: number };

/** 指定されたユーザーがお気に入り登録したユーザーを取得する */
export const useFavoritedUsers = ({ userId, page }: UseFavoritedUsersArgs) => {
  const { data: favoritedUsers, ...others } =
    trpc.user.getFavoritedUsers.useQuery(
      { favoriteByUserId: userId, page: page.toString() },
      { keepPreviousData: true }
    );

  return { favoritedUsers, ...others };
};
