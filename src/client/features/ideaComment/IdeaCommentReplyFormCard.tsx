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
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "../../../share/schema/ideaComment";
import { OmitStrict } from "../../../types/OmitStrict";
import { useDebouncedSubmitting } from "../../lib/useDebouncedSubmitting";
import { PlainTextarea } from "../../ui/PlainTextarea";

type Props = {
  inReplyToCommentId: string;
  ideaId: string;
  onSubmit: (data: OmitStrict<IdeaCommentFormData, "ideaId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const IdeaCommentReplyFormCard: React.FC<Props> = ({
  ideaId,
  inReplyToCommentId,
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
    defaultValues: { ideaId, inReplyToCommentId, comment: "" },
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
          name="comment"
          render={({ field }) => {
            return (
              <PlainTextarea
                placeholder="コメントに返信する"
                autosize
                minRows={5}
                error={errors.comment !== undefined}
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
            sx={{ visibility: errors.comment ? "visible" : "hidden" }}
          >
            <TbAlertCircle size={30} color={colors.red[7]} />
            <Text color="red">{errors.comment?.message}</Text>
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
