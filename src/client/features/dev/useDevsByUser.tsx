import { developmentKeys } from "@/client/features/dev/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseDevelopmentsByUserArgs = { userId: string; page: number };

/** ユーザーが開発した開発情報を取得する */
export const useDevsByUser = ({ userId, page }: UseDevelopmentsByUserArgs) => {
  const { data: developmentsByUser, ...others } = useQuery({
    queryKey: developmentKeys.listByUser(userId, page),
    queryFn: () => {
      return __trpc_old.development.getDevelopmentsByUser.query({
        userId,
        page,
      });
    },
    keepPreviousData: true,
  });

  return { developmentsByUser, ...others };
};
