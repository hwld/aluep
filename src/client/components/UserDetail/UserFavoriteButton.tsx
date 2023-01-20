import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiUserX } from "react-icons/bi";

type Props = {
  onFavorite: () => void;
  favorited?: boolean;
  userName?: string | null;
};
export const UserFavoriteButton: React.FC<Props> = ({
  onFavorite,
  favorited,
  userName,
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
          <Modal
            opened={opened}
            onClose={close}
            centered
            title="お気に入りの解除"
          >
            <Text>{userName}のお気に入りを解除してもいいですか？</Text>
            <Flex mt="lg" gap="sm" justify="flex-end">
              <Button variant="outline" onClick={close}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  onFavorite();
                  close();
                }}
                leftIcon={<BiUserX size={20} />}
                loaderProps={{ size: 20 }}
              >
                解除する
              </Button>
            </Flex>
          </Modal>
          <Button variant="light" onClick={open} compact>
            お気に入り中
          </Button>
        </>
      )}
    </>
  );
};
