import { trpc } from "@/client/lib/trpc";

type UseFavoriteUserArgs = { userId: string };
export const useFavoriteUser = ({ userId }: UseFavoriteUserArgs) => {
  const { data: favorited } = trpc.user.isFavoritedByLoggedInUser.useQuery({
    userId,
  });

  const createFavoriteMutation = trpc.user.favorite.useMutation();

  const deleteFavoriteMutation = trpc.user.unfavorite.useMutation();

  return {
    favorited,
    createFavoriteMutation,
    deleteFavoriteMutation,
  };
};
