import { userKeys } from "@/client/features/user/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseDevelopmentLikersArgs = { developmentId: string; page: number };

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevelopmentLikers = ({
  developmentId,
  page,
}: UseDevelopmentLikersArgs) => {
  const { data: developmentLikers, ...others } = useQuery({
    queryKey: userKeys.developmentLikers(developmentId, page),
    queryFn: () => {
      return __trpc_old.user.getDevelopmentLikers.query({
        developmentId,
        page,
      });
    },
    keepPreviousData: true,
  });

  return { developmentLikers, ...others };
};
