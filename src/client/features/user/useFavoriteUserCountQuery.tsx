import { trpc } from "@/client/lib/trpc";

type UseFavoriteUserCountQueryArgs = { userId: string };

export const useFavoriteUserCountQuery = ({
  userId,
}: UseFavoriteUserCountQueryArgs) => {
  const { data: favoriteUserCount, ...others } =
    trpc.user.getFavoriteCountByUser.useQuery({ userId });

  return { favoriteUserCount, ...others };
};
