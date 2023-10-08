import { trpc } from "@/client/lib/trpc";

type UseDevelopmentsByUserArgs = { userId: string; page: number };

/** ユーザーが開発した開発情報を取得する */
export const useDevsByUser = ({ userId, page }: UseDevelopmentsByUserArgs) => {
  const { data: developmentsByUser, ...others } =
    trpc.development.getDevelopmentsByUser.useQuery(
      { userId, page },
      { keepPreviousData: true }
    );

  return { developmentsByUser, ...others };
};
