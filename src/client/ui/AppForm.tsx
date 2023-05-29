import { Button, Flex, Stack } from "@mantine/core";
import { useId } from "@mantine/hooks";
import { FormEventHandler, PropsWithChildren } from "react";
import { IconType } from "react-icons/lib";
import { useDebouncedSubmitting } from "../lib/useDebouncedSubmitting";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText: string;
  submitIcon: IconType;
} & PropsWithChildren;

export const AppForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText,
  submitIcon: SubmitIcon,
  children,
}) => {
  const formId = useId();

  const { debouncedSubmitting, handleCancel, handleSubmit } =
    useDebouncedSubmitting({ isSubmitting, onCancel, onSubmit });

  return (
    <>
      {/* formのネストを防ぐために、フォームを独立させる */}
      <form onSubmit={handleSubmit} id={formId} />
      <Stack spacing="lg">
        <Stack spacing="md">{children}</Stack>
        <Flex gap="sm" justify="flex-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={debouncedSubmitting}
          >
            キャンセル
          </Button>
          <Button
            form={formId}
            type="submit"
            loading={debouncedSubmitting}
            leftIcon={<SubmitIcon size={20} />}
            loaderProps={{ size: 20 }}
          >
            {submitText}
          </Button>
        </Flex>
      </Stack>
    </>
  );
};
