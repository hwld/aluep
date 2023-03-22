import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const postedIdeasPerPageQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "posted-ideas",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedIdeasPerPageQuery = (userId: string, page: number) => {
  const { data: postedIdeasPerPage, ...others } = useQuery({
    queryKey: postedIdeasPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.idea.getPostedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { postedIdeasPerPage, ...others };
};
