import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const developedIdeasPerPageQueryKey = (userId: string, page: number) =>
  [
    ...userQueryKey(userId),
    "developed-ideas",
    { page: isNaN(page) ? 1 : page },
  ] as const;

/** ユーザーが開発しているお題一覧を取得する */
export const useDevelopedIdeasPerPage = (userId: string, page: number) => {
  const { data: developedIdeasPerPage, ...others } = useQuery({
    queryKey: developedIdeasPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.idea.getDevelopedIdeasByUser.query({
        userId: userId,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { developedIdeasPerPage, ...others };
};
