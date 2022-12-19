import { Button, Flex, Stack } from "@mantine/core";
import { useDebouncedValue, useId } from "@mantine/hooks";
import { FormEventHandler, PropsWithChildren } from "react";
import { IconType } from "react-icons/lib";

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

  // すぐに終わる操作で一瞬インジケータが表示されるのを防ぐために、
  // isSubmittingが変更されてから250ms経過した後に反映させる。
  const [debouncedSubmitting] = useDebouncedValue(isSubmitting, 250);

  return (
    <>
      {/* formのネストを防ぐために、フォームを独立させる */}
      <form onSubmit={onSubmit} id={formId} />
      <Stack spacing="md">{children}</Stack>
      <Flex gap="sm" mt="lg">
        <Button
          form={formId}
          type="submit"
          loading={debouncedSubmitting}
          leftIcon={<SubmitIcon size={20} />}
          loaderProps={{ size: 20 }}
        >
          {submitText}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={debouncedSubmitting}
        >
          キャンセル
        </Button>
      </Flex>
    </>
  );
};
