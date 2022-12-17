import { Button, Flex, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { BiTrashAlt } from "react-icons/bi";
import { AppModal } from "../AppModal";

type Props = {
  opened: boolean;
  onClose: () => void;
  onDeleteTheme: () => void;
  deleting?: boolean;
};
export const ThemeDeleteModal: React.FC<Props> = ({
  opened,
  onClose,
  onDeleteTheme,
  deleting,
}) => {
  const [debouncedDeleting] = useDebouncedValue(deleting, 250);

  return (
    <AppModal opened={opened} onClose={onClose} title="お題の削除">
      <Text c="gray.5" size="md">
        お題を削除してもよろしいですか？
        <br />
        お題を削除すると、もらった「いいね」、開発者の情報が完全に削除されます。
      </Text>
      <Flex mt="lg" gap="sm" justify="flex-end">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={debouncedDeleting}
        >
          キャンセル
        </Button>
        <Button
          loading={debouncedDeleting}
          onClick={onDeleteTheme}
          leftIcon={<BiTrashAlt size={20} />}
          loaderProps={{ size: 20 }}
        >
          削除する
        </Button>
      </Flex>
    </AppModal>
  );
};
