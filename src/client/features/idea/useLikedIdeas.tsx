import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

type UseLikedIdeasArgs = { userId: string; page: number };

/** ユーザーが良いねしたお題を取得する */
export const useLikedIdeas = ({ userId, page }: UseLikedIdeasArgs) => {
  const { data: likedIdeas, ...others } = useQuery({
    queryKey: ideaKeys.likedList(userId, page),
    queryFn: () => {
      return trpc.idea.getLikedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedIdeas, ...others };
};
