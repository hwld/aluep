import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useIdeaLikingUsersPerPage = (ideaId: string, page: number) => {
  const { data: ideaLikingUsersPerPage, ...others } = useQuery({
    queryKey: userKeys.ideaLikingList(ideaId, page),
    queryFn: () => {
      return trpc.user.getIdeaLikingUsers.query({ ideaId, page });
    },
    keepPreviousData: true,
  });

  return { ideaLikingUsersPerPage, ...others };
};
