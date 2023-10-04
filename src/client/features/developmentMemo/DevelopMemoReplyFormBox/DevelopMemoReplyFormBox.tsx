import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import {
  DevelopmentMemoFormData,
  developmentMemoFormSchema,
} from "@/models/developmentMemo";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import { TbAlertCircle } from "react-icons/tb";
import classes from "./DevelopMemoReplyFormBox.module.css";

type Props = {
  onSubmit: (data: DevelopmentMemoFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

// TODO: スタイルをDevelopmentMemoFormCardとある程度共通化したい
export const DevelopmentMemoReplyFormBox: React.FC<Props> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { colors } = useMantineTheme();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<DevelopmentMemoFormData>({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(developmentMemoFormSchema),
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
            <TbAlertCircle size={30} color={colors.red[7]} />
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
                <MdOutlineInsertComment
                  size={20}
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
