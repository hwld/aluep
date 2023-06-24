import { userKeys } from "@/client/features/user/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export type ReceivedLikeCount = {
  ideaLikeCount: number;
  developmentLikeCount: number;
};

type UseReceivedLikeCountQueryArgs = { userId: string };

export const useReceivedLikeCountQuery = ({
  userId,
}: UseReceivedLikeCountQueryArgs) => {
  const { data: recievedLikeCount, ...others } = useQuery({
    queryKey: userKeys.receivedLikeCount(userId),
    queryFn: () => {
      return trpc.user.getReceivedLikeCount.query({ userId });
    },
  });

  return { recievedLikeCount, ...others };
};
