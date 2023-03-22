import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const sumIdeaLikesQueryKey = (userId: string) => [
  userId,
  "sumIdeaLikes",
];
export const useSumIdeaLikesQuery = (userId: string) => {
  const { data: sumIdeaLikes, ...others } = useQuery({
    queryKey: sumIdeaLikesQueryKey(userId),
    queryFn: () => {
      return trpc.idea.getLikeCountByUser.query({ userId: userId });
    },
  });
  return { sumIdeaLikes, ...others };
};
