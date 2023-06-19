import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

/** ユーザーが良いねしたお題を取得する */
export const useLikedIdeasPerPage = (userId: string, page: number) => {
  const { data: likedIdeasPerPage, ...others } = useQuery({
    queryKey: ideaKeys.likedListPerPage(userId, page),
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
