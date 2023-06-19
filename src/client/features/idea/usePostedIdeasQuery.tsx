import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedIdeasPerPageQuery = (userId: string, page: number) => {
  const { data: postedIdeasPerPage, ...others } = useQuery({
    queryKey: ideaKeys.postedListPerPage(userId, page),
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
