import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

type UseFavoriteUserCountQueryArgs = { userId: string };

export const useFavoriteUserCountQuery = ({
  userId,
}: UseFavoriteUserCountQueryArgs) => {
  const { data: favoriteUserCount, ...others } = useQuery({
    queryKey: userKeys.favoriteCount(userId),
    queryFn: () => {
      return trpc.user.getFavoriteCountByUser.query({ userId });
    },
  });

  return { favoriteUserCount, ...others };
};
