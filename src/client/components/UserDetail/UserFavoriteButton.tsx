import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  onFavorite: () => void;
  favorited?: boolean;
};
export const UserFavoriteButton: React.FC<Props> = ({
  onFavorite,
  favorited,
}) => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      {!favorited ? (
        <>
          <Button onClick={onFavorite} compact>
            お気に入り
          </Button>
        </>
      ) : (
        <>
          <Modal opened={opened} onClose={close} centered>
            <Button onClick={onFavorite}>解除する</Button>
          </Modal>
          <Button variant="light" onClick={open} compact>
            お気に入りの解除
          </Button>
        </>
      )}
    </>
  );
};
