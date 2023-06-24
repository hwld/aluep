import { userKeys } from "@/client/features/user/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { RouterInputs } from "@/server/lib/trpc";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

type UseFavoriteUserArgs = { userId: string; loggedInUserId?: string };
export const useFavoriteUser = ({
  userId,
  loggedInUserId,
}: UseFavoriteUserArgs) => {
  const queryClient = useQueryClient();

  const { data: favorited } = useQuery({
    queryKey: userKeys.isFavorited(userId, loggedInUserId),
    queryFn: () => {
      return trpc.user.isFavoritedByLoggedInUser.query({ userId });
    },
  });

  const createFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["favorite"]) => {
      return trpc.user.favorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        userKeys.isFavorited(userId, loggedInUserId)
      );
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["unfavorite"]) => {
      return trpc.user.unfavorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        userKeys.isFavorited(userId, loggedInUserId)
      );
    },
  });

  return {
    favorited,
    createFavoriteMutation,
    deleteFavoriteMutation,
  };
};
