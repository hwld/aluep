import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevelopmentLikingUsersPerPage = (
  developmentId: string,
  page: number
) => {
  const { data: developmentLikingUsersPerPage, ...others } = useQuery({
    queryKey: userKeys.developmentLikingList(developmentId, page),
    queryFn: () => {
      return trpc.user.getDevelopmentLikingUsers.query({ developmentId, page });
    },
    keepPreviousData: true,
  });

  return { developmentLikingUsersPerPage, ...others };
};
