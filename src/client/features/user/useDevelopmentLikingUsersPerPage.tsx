import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { developmentQuerykey } from "../development/useDevelopmentQuery";

export const developmentLikingUsersPerPageQueryKey = (
  developmentId: string,
  page: number
) => {
  return [
    ...developmentQuerykey(developmentId),
    "liking-users",
    { page: isNaN(page) ? 1 : page },
  ] as const;
};

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevelopmentLikingUsersPerPage = (
  developmentId: string,
  page: number
) => {
  const { data: developmentLikingUsersPerPage, ...others } = useQuery({
    queryKey: developmentLikingUsersPerPageQueryKey(developmentId, page),
    queryFn: () => {
      return trpc.user.getDevelopmentLikingUsers.query({ developmentId, page });
    },
    keepPreviousData: true,
  });

  return { developmentLikingUsersPerPage, ...others };
};
