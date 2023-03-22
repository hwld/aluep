import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const likedIdeasPerPageQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "liked-ideas",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが良いねしたお題を取得する */
export const useLikedIdeasPerPage = (userId: string, page: number) => {
  const { data: likedIdeasPerPage, ...others } = useQuery({
    queryKey: likedIdeasPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.idea.getLikedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedIdeasPerPage, ...others };
};
