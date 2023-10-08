import { trpc } from "@/client/lib/trpc";

type UseIdeaLikersArgs = { ideaId: string; page: number };

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useIdeaLikers = ({ ideaId, page }: UseIdeaLikersArgs) => {
  const { data: ideaLikers, ...others } = trpc.user.getIdeaLikers.useQuery(
    { ideaId, page },
    { keepPreviousData: true }
  );

  return { ideaLikers, ...others };
};
