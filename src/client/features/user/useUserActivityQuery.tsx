import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

export type UserActivity = {
  postedIdeaCount: number;
  developmentCount: number;
  likedIdeaCount: number;
};

export const useUserActivityQuery = (userId: string) => {
  const { data: userActivity, ...others } = useQuery({
    queryKey: userKeys.activity(userId),
    queryFn: () => {
      return trpc.user.getUserActivity.query({ userId });
    },
  });

  return { userActivity, ...others };
};
