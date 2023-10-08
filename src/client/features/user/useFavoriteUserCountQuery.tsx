import { userKeys } from "@/client/features/user/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseFavoriteUserCountQueryArgs = { userId: string };

export const useFavoriteUserCountQuery = ({
  userId,
}: UseFavoriteUserCountQueryArgs) => {
  const { data: favoriteUserCount, ...others } = useQuery({
    queryKey: userKeys.favoriteCount(userId),
    queryFn: () => {
      return __trpc_old.user.getFavoriteCountByUser.query({ userId });
    },
  });

  return { favoriteUserCount, ...others };
};
