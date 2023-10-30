import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { Button, Flex, Stack } from "@mantine/core";
import { FormEventHandler, PropsWithChildren, SVGProps, useId } from "react";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText: string;
  submitIcon: React.FC<SVGProps<SVGSVGElement>>;
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
      <Stack gap="lg">
        <Stack gap="md">{children}</Stack>
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
            leftSection={
              <SubmitIcon
                width={20}
                height={20}
                opacity={debouncedSubmitting ? 0.2 : 1}
              />
            }
            loaderProps={{ size: 20 }}
          >
            {submitText}
          </Button>
        </Flex>
      </Stack>
    </>
  );
};
