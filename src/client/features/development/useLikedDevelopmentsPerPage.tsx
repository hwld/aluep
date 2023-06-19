import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

/** ユーザーがいいねした開発情報を取得する */
export const useLikedDevelopmentsPerPage = (userId: string, page: number) => {
  const { data: likedDevelopmentsPerPage, ...others } = useQuery({
    queryKey: developmentKeys.likedListPerPage(userId, page),
    queryFn: () => {
      return trpc.development.getLikedDevelopmentsByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedDevelopmentsPerPage, ...others };
};
