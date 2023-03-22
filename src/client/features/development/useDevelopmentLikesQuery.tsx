import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const developmentLikesQueryKey = (userId: string) => [
  userId,
  "developmentLikes",
];
export const useDevelopmentLikesQuery = (userId: string) => {
  const { data: developmentLikes, ...others } = useQuery({
    queryKey: developmentLikesQueryKey(userId),
    queryFn: () => {
      return trpc.development.getLikeCountByUser.query({
        userId: userId,
      });
    },
  });

  return { developmentLikes, ...others };
};
