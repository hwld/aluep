import { useIdeaComments } from "@/client/features/ideaComment/useIdeaComments";
import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "@/models/ideaComment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconMessage2 } from "@tabler/icons-react";
import clsx from "clsx";
import { User } from "next-auth";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import classes from "./IdeaCommentForm.module.css";

type Props = {
  ideaId: string;
  loggedInUser: User;
};

export type IdeaCommentFormRef = {
  scrollIntoView: Element["scrollIntoView"];
  focusCommentInput: () => void;
};

export const IdeaCommentForm = forwardRef<IdeaCommentFormRef, Props>(
  function IdeaCommentForm({ ideaId, loggedInUser }, ref) {
    const {
      control,
      handleSubmit: innerHandleSubmit,
      formState: { errors },
      reset,
    } = useForm<IdeaCommentFormData>({
      defaultValues: { text: "" },
      resolver: zodResolver(ideaCommentFormSchema),
    });

    const { postCommentMutation } = useIdeaComments({ ideaId });
    const { debouncedSubmitting, handleSubmit } = useDebouncedSubmitting({
      isSubmitting: postCommentMutation.isLoading,
      onSubmit: innerHandleSubmit((data) => {
        postCommentMutation.mutate(
          { ...data, ideaId },
          {
            onSuccess: () => {
              reset();
            },
          }
        );
      }),
    });

    const formRef = useRef<HTMLFormElement | null>(null);
    const commentRef = useRef<HTMLTextAreaElement | null>(null);
    useImperativeHandle(ref, (): IdeaCommentFormRef => {
      return {
        scrollIntoView: (arg?: boolean | ScrollIntoViewOptions) => {
          formRef.current?.scrollIntoView(arg);
        },
        focusCommentInput: () => {
          commentRef.current?.focus();
        },
      };
    });

    return (
      <form onSubmit={handleSubmit} ref={formRef}>
        <Flex align="center" gap={5}>
          <UserIcon iconSrc={loggedInUser.image} />
          <Text>{loggedInUser.name}</Text>
        </Flex>
        <Controller
          control={control}
          name="text"
          render={({ field }) => {
            return (
              <PlainTextarea
                mt="xs"
                placeholder="コメントする"
                autosize
                minRows={5}
                error={errors.text !== undefined}
                {...field}
                ref={(e) => {
                  field.ref(e);
                  commentRef.current = e;
                }}
              />
            );
          }}
        />
        <Divider />
        <Flex mt="xs" justify="space-between">
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
          <Button
            type="submit"
            loading={debouncedSubmitting}
            leftSection={
              <IconMessage2
                width={20}
                height={20}
                opacity={debouncedSubmitting ? 0.3 : 1}
              />
            }
            loaderProps={{ size: 20 }}
          >
            送信
          </Button>
        </Flex>
      </form>
    );
  }
);
