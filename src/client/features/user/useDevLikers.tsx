import { trpc } from "@/client/lib/trpc";

type UseDevLikersArgs = { devId: string; page: number };

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevLikers = ({ devId, page }: UseDevLikersArgs) => {
  const { data: devLikers, ...others } = trpc.user.getDevLikers.useQuery(
    { devId, page },
    { keepPreviousData: true }
  );

  return { devLikers, ...others };
};
