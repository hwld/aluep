import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";

export const favoriteUserQueryKey = (
  userId: string,
  loggedInUserId: string = ""
) => ["user", "favoriteUserId", userId, loggedInUserId];

export const favoriteSumQueryKey = (favoriteUserId: string) => [
  "favoriteUserId",
  favoriteUserId,
];

export const useFavoriteUser = (userId: string, loggedInUserId: string) => {
  const queryClient = useQueryClient();

  const { data: favorited } = useQuery({
    queryKey: favoriteUserQueryKey(userId, loggedInUserId),
    queryFn: () => {
      return trpc.user.favorited.query({ userId });
    },
  });

  const { data: favoritedSum } = useQuery({
    queryKey: favoriteSumQueryKey(loggedInUserId),
    queryFn: () => {
      return trpc.user.favoritedSum.query({ favoriteUserId: loggedInUserId });
    },
  });

  const createFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["crateFavorite"]) => {
      return trpc.user.crateFavorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        favoriteUserQueryKey(userId, loggedInUserId)
      );
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["deleteFavorite"]) => {
      return trpc.user.deleteFavorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        favoriteUserQueryKey(userId, loggedInUserId)
      );
    },
  });

  return {
    favorited,
    favoritedSum,
    createFavoriteMutation,
    deleteFavoriteMutation,
  };
};
