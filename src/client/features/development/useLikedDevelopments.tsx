import { developmentKeys } from "@/client/features/development/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseLikedDevelopmentsArgs = { userId: string; page: number };
/** ユーザーがいいねした開発情報を取得する */
export const useLikedDevelopments = ({
  userId,
  page,
}: UseLikedDevelopmentsArgs) => {
  const { data: likedDevelopments, ...others } = useQuery({
    queryKey: developmentKeys.likedList(userId, page),
    queryFn: () => {
      return trpc.development.getLikedDevelopmentsByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedDevelopments, ...others };
};
