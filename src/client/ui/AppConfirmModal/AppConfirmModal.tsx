import { AppModal } from "@/client/ui/AppModal/AppModal";
import { Button, Flex, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ReactNode, SVGProps } from "react";

type Props = {
  title: string;
  message: ReactNode;
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  confirmIcon: React.FC<SVGProps<SVGSVGElement>>;
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
      <Text>{message}</Text>
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
          leftSection={
            <ConfirmIcon
              width={20}
              height={20}
              opacity={debouncedConfirming ? 0.2 : 1}
            />
          }
          loaderProps={{ size: 20 }}
        >
          {confirmText}
        </Button>
      </Flex>
    </AppModal>
  );
};
