import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";

export const favoriteUserQueryKey = (
  userId: string,
  favoriteUserId: string
) => ["user", "favoriteUserId", userId, favoriteUserId];

export const favoriteSumQueryKey = (favoriteUserId: string) => [
  "favoriteUserId",
  favoriteUserId,
];

export const useFavoriteUser = (userId: string, favoriteUserId: string) => {
  const queryClient = useQueryClient();
  const { data: favorited } = useQuery({
    queryKey: favoriteUserQueryKey(userId, favoriteUserId),
    queryFn: () => {
      return trpc.user.favorited.query({ userId, favoriteUserId });
    },
  });

  const { data: favoritedSum } = useQuery({
    queryKey: favoriteSumQueryKey(favoriteUserId),
    queryFn: () => {
      return trpc.user.favoritedSum.query({ favoriteUserId });
    },
  });

  const createFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["crateFavorite"]) => {
      return trpc.user.crateFavorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        favoriteUserQueryKey(userId, favoriteUserId)
      );
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (data: RouterInputs["user"]["deleteFavorite"]) => {
      return trpc.user.deleteFavorite.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        favoriteUserQueryKey(userId, favoriteUserId)
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
