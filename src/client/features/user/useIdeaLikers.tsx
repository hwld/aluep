import { userKeys } from "@/client/features/user/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseIdeaLikersArgs = { ideaId: string; page: number };

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useIdeaLikers = ({ ideaId, page }: UseIdeaLikersArgs) => {
  const { data: ideaLikers, ...others } = useQuery({
    queryKey: userKeys.ideaLikers(ideaId, page),
    queryFn: () => {
      return trpc.user.getIdeaLikers.query({ ideaId, page });
    },
    keepPreviousData: true,
  });

  return { ideaLikers, ...others };
};
