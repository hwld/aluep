import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

export type UserActivity = {
  postedIdeaCount: number;
  developmentCount: number;
  likedIdeaCount: number;
};

type UserUserActivityQueryArgs = { userId: string };

export const useUserActivityQuery = ({ userId }: UserUserActivityQueryArgs) => {
  const { data: userActivity, ...others } = useQuery({
    queryKey: userKeys.activity(userId),
    queryFn: () => {
      return trpc.user.getUserActivity.query({ userId });
    },
  });

  return { userActivity, ...others };
};
