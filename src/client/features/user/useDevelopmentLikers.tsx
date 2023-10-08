import { trpc } from "@/client/lib/trpc";

type UseDevelopmentLikersArgs = { developmentId: string; page: number };

/** 指定された開発情報をいいねしたユーザーを取得する */
export const useDevelopmentLikers = ({
  developmentId,
  page,
}: UseDevelopmentLikersArgs) => {
  const { data: developmentLikers, ...others } =
    trpc.user.getDevelopmentLikers.useQuery(
      { developmentId, page },
      { keepPreviousData: true }
    );

  return { developmentLikers, ...others };
};
