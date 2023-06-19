import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

type UsePostedIdeasQueryArgs = { userId: string; page: number };

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedIdeasQuery = ({
  userId,
  page,
}: UsePostedIdeasQueryArgs) => {
  const { data: postedIdeas, ...others } = useQuery({
    queryKey: ideaKeys.postedList(userId, page),
    queryFn: () => {
      return trpc.idea.getPostedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { postedIdeas, ...others };
};
