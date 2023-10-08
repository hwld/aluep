import { trpc } from "@/client/lib/trpc";

type UseLikedDevelopmentsArgs = { userId: string; page: number };
/** ユーザーがいいねした開発情報を取得する */
export const useLikedDevelopments = ({
  userId,
  page,
}: UseLikedDevelopmentsArgs) => {
  const { data: likedDevelopments, ...others } =
    trpc.development.getLikedDevelopmentsByUser.useQuery(
      { userId: userId, page: page.toString() },
      { keepPreviousData: true }
    );

  return { likedDevelopments, ...others };
};
