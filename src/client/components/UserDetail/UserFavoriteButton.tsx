import { Button } from "@mantine/core";

type Props = {
  onLikeTheme: () => void;
  favorited?: boolean;
};
export const UserFavoriteButton: React.FC<Props> = ({
  onLikeTheme,
  favorited,
}) => {
  return (
    <>
      {!favorited ? (
        <Button onClick={onLikeTheme} compact>
          お気に入り
        </Button>
      ) : (
        <Button variant="light" onClick={onLikeTheme} compact>
          お気に入りの解除
        </Button>
      )}
    </>
  );
};
