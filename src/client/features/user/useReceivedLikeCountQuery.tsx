import { trpc } from "@/client/lib/trpc";

export type ReceivedLikeCount = {
  ideaLikeCount: number;
  developmentLikeCount: number;
};

type UseReceivedLikeCountQueryArgs = { userId: string };

export const useReceivedLikeCountQuery = ({
  userId,
}: UseReceivedLikeCountQueryArgs) => {
  const { data: recievedLikeCount, ...others } =
    trpc.user.getReceivedLikeCount.useQuery({ userId });

  return { recievedLikeCount, ...others };
};
