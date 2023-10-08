import { ideaKeys } from "@/client/features/idea/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UsePostedIdeasQueryArgs = { userId: string; page: number };

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedIdeasQuery = ({
  userId,
  page,
}: UsePostedIdeasQueryArgs) => {
  const { data: postedIdeas, ...others } = useQuery({
    queryKey: ideaKeys.postedList(userId, page),
    queryFn: () => {
      return __trpc_old.idea.getPostedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { postedIdeas, ...others };
};
