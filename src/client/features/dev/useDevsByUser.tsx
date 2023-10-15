import { trpc } from "@/client/lib/trpc";

type UseDevsByUserArgs = { userId: string; page: number };

/** ユーザーが開発した開発情報を取得する */
export const useDevsByUser = ({ userId, page }: UseDevsByUserArgs) => {
  const { data: devsByUser, ...others } = trpc.dev.getDevsByUser.useQuery(
    { userId, page },
    { keepPreviousData: true }
  );

  return { devsByUser, ...others };
};
