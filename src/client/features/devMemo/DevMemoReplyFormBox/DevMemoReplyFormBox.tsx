import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import { DevMemoFormData, devMemoFormSchema } from "@/models/devMemo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconMessage2 } from "@tabler/icons-react";
import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import classes from "./DevMemoReplyFormBox.module.css";

type Props = {
  onSubmit: (data: DevMemoFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const DevMemoReplyFormBox: React.FC<Props> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<DevMemoFormData>({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(devMemoFormSchema),
  });

  const { debouncedSubmitting, handleSubmit, handleCancel } =
    useDebouncedSubmitting({
      isSubmitting,
      onCancel,
      onSubmit: innerHandleSubmit(onSubmit),
    });

  const handleFocusTextarea = () => {
    textareaRef.current?.focus();
  };

  useLayoutEffect(() => {
    textareaRef.current?.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box p="xs" className={classes.root} onClick={handleFocusTextarea}>
      <form onSubmit={handleSubmit}>
        <Controller
          control={control}
          name="text"
          render={({ field }) => {
            return (
              <PlainTextarea
                placeholder="メモに返信する"
                autosize
                minRows={5}
                error={errors.text !== undefined}
                {...field}
                ref={(e) => {
                  field.ref(e);
                  textareaRef.current = e;
                }}
              />
            );
          }}
        />
        <Divider my="xs" />
        <Flex mt="xs" justify="space-between" gap="sm">
          <Flex
            align="center"
            gap={5}
            className={clsx(classes["error-message"], {
              [classes.show]: errors.text,
            })}
          >
            <IconAlertCircle
              width={30}
              height={30}
              color="var(--mantine-color-red-7)"
            />
            <Text c="red">{errors.text?.message}</Text>
          </Flex>
          <Flex gap="xs">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={debouncedSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              loading={debouncedSubmitting}
              leftSection={
                <IconMessage2
                  width={20}
                  height={20}
                  style={{ opacity: debouncedSubmitting ? 0.3 : 1 }}
                />
              }
              loaderProps={{ size: 20 }}
            >
              返信
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};
