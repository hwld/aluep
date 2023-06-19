import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevelopmentLikersPerPage = (
  developmentId: string,
  page: number
) => {
  const { data: developmentLikersPerPage, ...others } = useQuery({
    queryKey: userKeys.developmentLikers(developmentId, page),
    queryFn: () => {
      return trpc.user.getDevelopmentLikers.query({ developmentId, page });
    },
    keepPreviousData: true,
  });

  return { developmentLikersPerPage, ...others };
};
