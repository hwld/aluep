import { Button } from "@mantine/core";

type Props = {
  onFavorite: () => void;
  favorited?: boolean;
};
export const UserFavoriteButton: React.FC<Props> = ({
  onFavorite,
  favorited,
}) => {
  return (
    <>
      {!favorited ? (
        <Button onClick={onFavorite} compact>
          お気に入り
        </Button>
      ) : (
        <Button variant="light" onClick={onFavorite} compact>
          お気に入りの解除
        </Button>
      )}
    </>
  );
};
