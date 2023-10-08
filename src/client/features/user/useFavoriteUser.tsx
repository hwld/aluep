import { trpc } from "@/client/lib/trpc";

type UseFavoriteUserArgs = { userId: string; loggedInUserId?: string };
export const useFavoriteUser = ({
  userId,
  loggedInUserId,
}: UseFavoriteUserArgs) => {
  const utils = trpc.useContext();

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
