import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";

export const favoritedUserQueryKey = (
  userId: string,
  loggedInUserId?: string
) => ["user", "favoriteUserId", userId, loggedInUserId];

export const useFavoriteUser = (userId: string, loggedInUserId?: string) => {
  const queryClient = useQueryClient();

  const { data: favorited } = useQuery({
    queryKey: favoritedUserQueryKey(userId, loggedInUserId),
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
        favoritedUserQueryKey(userId, loggedInUserId)
      );
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["unfavorite"]) => {
      return trpc.user.unfavorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        favoritedUserQueryKey(userId, loggedInUserId)
      );
    },
  });

  return {
    favorited,
    createFavoriteMutation,
    deleteFavoriteMutation,
  };
};
