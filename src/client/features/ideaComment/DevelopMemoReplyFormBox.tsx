import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useLayoutEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import { TbAlertCircle } from "react-icons/tb";
import {
  DevelopmentMemoFormData,
  developmentMemoFormSchema,
} from "../../../share/schema";
import { useDebouncedSubmitting } from "../../lib/useDebouncedSubmitting";
import { PlainTextarea } from "../../ui/PlainTextarea";

type Props = {
  parentMemoId: string;
  developmentId: string;
  onSubmit: (data: DevelopmentMemoFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const DevelopmentMemoReplyFormBox: React.FC<Props> = ({
  developmentId,
  parentMemoId,
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
      developmentId,
      parentMemoId,
      memo: "",
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
    <Box
      p="xs"
      sx={(theme) => ({
        borderRadius: theme.radius.md,
        border: "1px solid",
        borderColor: theme.colors.gray[4],
      })}
      onClick={handleFocusTextarea}
    >
      <form onSubmit={handleSubmit}>
        <Controller
          control={control}
          name="memo"
          render={({ field }) => {
            return (
              <PlainTextarea
                placeholder="メモに返信する"
                autosize
                minRows={5}
                error={errors.memo !== undefined}
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
            sx={{ visibility: errors.memo ? "visible" : "hidden" }}
          >
            <TbAlertCircle size={30} color={colors.red[7]} />
            <Text color="red">{errors.memo?.message}</Text>
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
              leftIcon={<MdOutlineInsertComment size={20} />}
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
