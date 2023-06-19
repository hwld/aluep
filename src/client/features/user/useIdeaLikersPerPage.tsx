import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useIdeaLikersPerPage = (ideaId: string, page: number) => {
  const { data: ideaLikersPerPage, ...others } = useQuery({
    queryKey: userKeys.ideaLikers(ideaId, page),
    queryFn: () => {
      return trpc.user.getIdeaLikers.query({ ideaId, page });
    },
    keepPreviousData: true,
  });

  return { ideaLikersPerPage, ...others };
};
