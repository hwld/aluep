import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "./useUserQuery";

export type UserActivity = {
  postedIdeaCount: number;
  developmentCount: number;
  likedIdeaCount: number;
};

export const userActivityQueryKey = (userId: string) =>
  [...userQueryKey(userId), "user-activity"] as const;

export const useUserActivityQuery = (userId: string) => {
  const { data: userActivity, ...others } = useQuery({
    queryKey: userActivityQueryKey(userId),
    queryFn: () => {
      return trpc.user.getUserActivity.query({ userId });
    },
  });

  return { userActivity, ...others };
};
