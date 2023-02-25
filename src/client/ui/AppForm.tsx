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
  // ただ、その間にキャンセルボタンやSubmitボタンを押されたくないので、
  // スタイルには反映させないが、内部的には押しても何も起こらないようにする。
  const [debouncedSubmitting] = useDebouncedValue(isSubmitting, 250);

  const handleCancel = () => {
    if (!isSubmitting) {
      onCancel();
    }
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      onSubmit(e);
    }
  };

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
