import { trpc } from "@/client/lib/trpc";

export type UserActivity = {
  postedIdeaCount: number;
  developmentCount: number;
  likedIdeaCount: number;
};

type UserUserActivityQueryArgs = { userId: string };

export const useUserActivityQuery = ({ userId }: UserUserActivityQueryArgs) => {
  const { data: userActivity, ...others } = trpc.user.getUserActivity.useQuery({
    userId,
  });

  return { userActivity, ...others };
};
