import { userKeys } from "@/client/features/user/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

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
