import { trpc } from "@/client/lib/trpc";

type UseLikedDevsArgs = { userId: string; page: number };

/** ユーザーがいいねした開発情報を取得する */
export const useLikedDevs = ({ userId, page }: UseLikedDevsArgs) => {
  const { data: likedDevs, ...others } = trpc.dev.getLikedDevsByUser.useQuery(
    { userId: userId, page },
    { keepPreviousData: true }
  );

  return { likedDevs, ...others };
};
