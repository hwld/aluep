import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { useFavoriteUser } from "@/client/features/user/useFavoriteUser";
import { Button } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type Props = {
  userId: string;
};

export const UserFavoriteButton: React.FC<Props> = ({ userId }) => {
  const { hovered: hoveredUnFavoriteButton, ref: unFavoriteButtonRef } =
    useHover<HTMLButtonElement>();
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const { favorited } = useFavoriteUser({ userId });
  const { createFavoriteMutation, deleteFavoriteMutation } = useFavoriteUser({
    userId,
  });

  const handleFavoriteUser = () => {
    if (session?.user.id === undefined) {
      openLoginModal();
      return;
    }
    createFavoriteMutation.mutate({ userId });
  };

  const handleUnFavoriteUser = () => {
    deleteFavoriteMutation.mutate({ userId });
  };

  return (
    <>
      {!favorited ? (
        <Button onClick={handleFavoriteUser} size="compact-sm">
          お気に入り
        </Button>
      ) : (
        <Button
          ref={unFavoriteButtonRef}
          variant="light"
          onClick={handleUnFavoriteUser}
          size="compact-sm"
        >
          {hoveredUnFavoriteButton ? "お気に入り解除" : "お気に入り中"}
        </Button>
      )}
    </>
  );
};
