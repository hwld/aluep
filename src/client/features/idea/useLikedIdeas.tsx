import { ideaKeys } from "@/client/features/idea/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseLikedIdeasArgs = { userId: string; page: number };

/** ユーザーが良いねしたお題を取得する */
export const useLikedIdeas = ({ userId, page }: UseLikedIdeasArgs) => {
  const { data: likedIdeas, ...others } = useQuery({
    queryKey: ideaKeys.likedList(userId, page),
    queryFn: () => {
      return __trpc_old.idea.getLikedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { likedIdeas, ...others };
};
