import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "@/models/ideaComment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconMessage2 } from "@tabler/icons-react";
import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import classes from "./IdeaCommentReplyFormCard.module.css";

type Props = {
  ideaId: string;
  parentCommentId: string;
  onClose: () => void;
};

export const IdeaCommentReplyFormCard: React.FC<Props> = ({
  ideaId,
  parentCommentId,
  onClose,
}) => {
  const innerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<IdeaCommentFormData>({
    defaultValues: { text: "" },
    resolver: zodResolver(ideaCommentFormSchema),
  });

  const replyMutation = useMutationWithNotification(trpc.ideaComment.create, {
    errorNotification: {
      title: "お題への返信",
      message: "お題に返信できませんでした。",
    },
    onSuccess: () => {
      onClose();
    },
  });

  const { debouncedSubmitting, handleSubmit, handleCancel } =
    useDebouncedSubmitting({
      isSubmitting: replyMutation.isLoading,
      onCancel: onClose,
      onSubmit: innerHandleSubmit((data) => {
        replyMutation.mutate({
          ...data,
          ideaId,
          parentCommentId: parentCommentId,
        });
      }),
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
              leftSection={<IconMessage2 width={20} height={20} />}
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
