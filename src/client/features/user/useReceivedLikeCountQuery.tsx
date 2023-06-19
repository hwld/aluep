import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

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
