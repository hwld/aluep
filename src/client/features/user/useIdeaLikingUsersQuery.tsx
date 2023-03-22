import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideasQueryKey } from "../idea/useIdeaQuery";

export const ideaLikingUsersPerPageQueryKey = (
  ideaId: string,
  page: number
) => {
  const p = isNaN(page) ? 1 : page;
  return [...ideasQueryKey, ideaId, "liking-users", { page: p }] as const;
};

/**
 * 指定されたお題をいいねしたユーザー一覧を返す
 */
export const useIdeaLikingUsersPerPage = (ideaId: string, page: number) => {
  const { data: ideaLikingUsersPerPage, ...others } = useQuery({
    queryKey: ideaLikingUsersPerPageQueryKey(ideaId, page),
    queryFn: () => {
      return trpc.user.getIdeaLikingUsers.query({
        ideaId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { ideaLikingUsersPerPage, ...others };
};
