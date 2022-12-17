import { Button, Flex, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { BiTrashAlt } from "react-icons/bi";
import { AppModal } from "../AppModal";

type Props = {
  opened: boolean;
  onClose: () => void;
  onDeleteDeveloepr: () => void;
  deleting?: boolean;
};
export const DeveloperDeleteModal: React.FC<Props> = ({
  opened,
  onClose,
  onDeleteDeveloepr,
  deleting,
}) => {
  const [debouncedDeleting] = useDebouncedValue(deleting, 250);

  return (
    <AppModal opened={opened} onClose={onClose} title="開発情報の削除">
      <Text c="gray.5" size="md">
        開発情報を削除してもよろしいですか？
        <br />
        開発情報を削除すると、もらった「いいね」の情報が完全に削除されます。
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
          onClick={onDeleteDeveloepr}
          leftIcon={<BiTrashAlt size={20} />}
          loaderProps={{ size: 20 }}
        >
          削除する
        </Button>
      </Flex>
    </AppModal>
  );
};
