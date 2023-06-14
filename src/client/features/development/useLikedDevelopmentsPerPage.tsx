import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const likedDevelopmentsPerPageQueryKey = (
  userId: string,
  page: number
) =>
  [
    ...userQueryKey(userId),
    "liked-developments",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーがいいねした開発情報を取得する */
export const useLikedDevelopmentsPerPage = (userId: string, page: number) => {
  const { data: likedDevelopmentsPerPage, ...others } = useQuery({
    queryKey: likedDevelopmentsPerPageQueryKey(userId, page),
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
