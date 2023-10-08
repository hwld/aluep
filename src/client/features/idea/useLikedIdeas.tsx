import { trpc } from "@/client/lib/trpc";

type UseLikedIdeasArgs = { userId: string; page: number };

/** ユーザーが良いねしたお題を取得する */
export const useLikedIdeas = ({ userId, page }: UseLikedIdeasArgs) => {
  const { data: likedIdeas, ...others } =
    trpc.idea.getLikedIdeasByUser.useQuery(
      {
        userId: userId,
        page: page.toString(),
      },
      {
        keepPreviousData: true,
      }
    );

  return { likedIdeas, ...others };
};
