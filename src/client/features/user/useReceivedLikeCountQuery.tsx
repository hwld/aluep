import { userKeys } from "@/client/features/user/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
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
      return __trpc_old.user.getReceivedLikeCount.query({ userId });
    },
  });

  return { recievedLikeCount, ...others };
};
