import { Button, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiUserX } from "react-icons/bi";
import { AppModal } from "../../../ui/AppModal";

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

  if (!favorited) {
    return (
      <Button onClick={onFavorite} compact>
        お気に入り
      </Button>
    );
  } else {
    return (
      <>
        <AppModal
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
        </AppModal>
        <Button variant="light" onClick={open} compact>
          お気に入り中
        </Button>
      </>
    );
  }
};
