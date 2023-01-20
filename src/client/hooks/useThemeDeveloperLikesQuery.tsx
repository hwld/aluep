import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themeDeveloperLikesQueryKey = (userId: string) => [
  userId,
  "themeDeveloperLikes",
];
export const useThemeDeveloperLikesQuery = (userId: string) => {
  const { data: themeDeveloperLikes, ...others } = useQuery({
    queryKey: themeDeveloperLikesQueryKey(userId),
    queryFn: () => {
      return trpc.user.getThemeDeveloperLike.query({ userId: userId });
    },
  });

  return { themeDeveloperLikes, ...others };
};
