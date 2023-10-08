import { trpc } from "@/client/lib/trpc";

type UsePostedIdeasQueryArgs = { userId: string; page: number };

/** ユーザーが投稿したお題一覧を取得する */
export const usePostedIdeasQuery = ({
  userId,
  page,
}: UsePostedIdeasQueryArgs) => {
  const { data: postedIdeas, ...others } =
    trpc.idea.getPostedIdeasByUser.useQuery(
      {
        userId: userId,
        page: page.toString(),
      },
      {
        keepPreviousData: true,
      }
    );

  return { postedIdeas, ...others };
};
