import { Button, Flex, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ReactNode } from "react";
import { IconType } from "react-icons/lib";
import { AppModal } from "./AppModal";

type Props = {
  title: string;
  message: ReactNode;
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  confirmIcon: IconType;
  confirmText: string;
};
export const AppConfirmModal: React.FC<Props> = ({
  title,
  message,
  opened,
  onClose,
  onConfirm,
  isConfirming,
  confirmIcon: ConfirmIcon,
  confirmText,
}) => {
  const [debouncedConfirming] = useDebouncedValue(isConfirming, 250);

  return (
    <AppModal opened={opened} onClose={onClose} title={title}>
      <Text c="gray.5" size="md">
        {message}
      </Text>
      <Flex mt="lg" gap="sm" justify="flex-end">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={debouncedConfirming}
        >
          キャンセル
        </Button>
        <Button
          loading={debouncedConfirming}
          onClick={onConfirm}
          leftIcon={<ConfirmIcon size={20} />}
          loaderProps={{ size: 20 }}
        >
          {confirmText}
        </Button>
      </Flex>
    </AppModal>
  );
};
