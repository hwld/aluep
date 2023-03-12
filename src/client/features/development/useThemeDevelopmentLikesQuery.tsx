import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const themeDevelopmentLikesQueryKey = (userId: string) => [
  userId,
  "themeDevelopmentLikes",
];
export const useThemeDevelopmentLikesQuery = (userId: string) => {
  const { data: themeDevelopmentLikes, ...others } = useQuery({
    queryKey: themeDevelopmentLikesQueryKey(userId),
    queryFn: () => {
      return trpc.development.getLikeCountByUser.query({
        userId: userId,
      });
    },
  });

  return { themeDevelopmentLikes, ...others };
};
