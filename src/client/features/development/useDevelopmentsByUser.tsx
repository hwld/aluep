import { developmentKeys } from "@/client/features/development/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseDevelopmentsByUserArgs = { userId: string; page: number };

/** ユーザーが開発した開発情報を取得する */
export const useDevelopmentsByUser = ({
  userId,
  page,
}: UseDevelopmentsByUserArgs) => {
  const { data: developmentsByUser, ...others } = useQuery({
    queryKey: developmentKeys.listByUser(userId, page),
    queryFn: () => {
      return trpc.development.getDevelopmentsByUser.query({ userId, page });
    },
    keepPreviousData: true,
  });

  return { developmentsByUser, ...others };
};
