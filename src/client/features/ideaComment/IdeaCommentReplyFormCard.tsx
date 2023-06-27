import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea";
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "@/models/ideaComment";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Divider,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useLayoutEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import { TbAlertCircle } from "react-icons/tb";

type Props = {
  onSubmit: (data: IdeaCommentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const IdeaCommentReplyFormCard: React.FC<Props> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { colors } = useMantineTheme();
  const innerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<IdeaCommentFormData>({
    defaultValues: { text: "" },
    resolver: zodResolver(ideaCommentFormSchema),
  });

  const { debouncedSubmitting, handleSubmit, handleCancel } =
    useDebouncedSubmitting({
      isSubmitting,
      onCancel,
      onSubmit: innerHandleSubmit(onSubmit),
    });

  const handleFocusTextarea = () => {
    innerTextareaRef.current?.focus();
  };

  useLayoutEffect(() => {
    innerTextareaRef.current?.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card onClick={handleFocusTextarea}>
      <form onSubmit={handleSubmit}>
        <Controller
          control={control}
          name="text"
          render={({ field }) => {
            return (
              <PlainTextarea
                placeholder="コメントに返信する"
                autosize
                minRows={5}
                error={errors.text !== undefined}
                {...field}
                ref={(e) => {
                  field.ref(e);
                  innerTextareaRef.current = e;
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
            sx={{ visibility: errors.text ? "visible" : "hidden" }}
          >
            <TbAlertCircle size={30} color={colors.red[7]} />
            <Text color="red">{errors.text?.message}</Text>
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
    </Card>
  );
};