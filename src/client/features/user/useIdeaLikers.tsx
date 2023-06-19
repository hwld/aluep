import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

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
