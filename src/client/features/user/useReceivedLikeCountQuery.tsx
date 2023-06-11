import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "./useUserQuery";

export type ReceivedLikeCount = {
  ideaLikeCount: number;
  developmentLikeCount: number;
};

export const receivedLikeCountQueryKey = (userId: string) => [
  ...userQueryKey(userId),
  "received-like-count",
];

export const useReceivedLikeCountQuery = (userId: string) => {
  const { data: recievedLikeCount, ...others } = useQuery({
    queryKey: receivedLikeCountQueryKey(userId),
    queryFn: () => {
      return trpc.user.getReceivedLikeCount.query({ userId });
    },
  });

  return { recievedLikeCount, ...others };
};
