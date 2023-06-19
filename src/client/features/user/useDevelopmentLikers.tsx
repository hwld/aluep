import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

type UseDevelopmentLikersArgs = { developmentId: string; page: number };

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevelopmentLikers = ({
  developmentId,
  page,
}: UseDevelopmentLikersArgs) => {
  const { data: developmentLikers, ...others } = useQuery({
    queryKey: userKeys.developmentLikers(developmentId, page),
    queryFn: () => {
      return trpc.user.getDevelopmentLikers.query({ developmentId, page });
    },
    keepPreviousData: true,
  });

  return { developmentLikers, ...others };
};
