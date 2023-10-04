import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "@/models/ideaComment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "next-auth";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import { TbAlertCircle } from "react-icons/tb";

type Props = {
  ideaId: string;
  loggedInUser: User;
  onSubmit: (data: IdeaCommentFormData) => void;
  isSubmitting?: boolean;
};

export type IdeaCommentFormRef = {
  scrollIntoView: Element["scrollIntoView"];
  focusCommentInput: () => void;
};

export const IdeaCommentForm = forwardRef<IdeaCommentFormRef, Props>(
  function IdeaCommentForm(
    { ideaId, onSubmit, isSubmitting = false, loggedInUser },
    ref
  ) {
    const { colors } = useMantineTheme();
    const formRef = useRef<HTMLFormElement | null>(null);
    const commentRef = useRef<HTMLTextAreaElement | null>(null);

    const {
      control,
      handleSubmit: innerHandleSubmit,
      formState: { errors },
    } = useForm<IdeaCommentFormData>({
      defaultValues: { text: "" },
      resolver: zodResolver(ideaCommentFormSchema),
    });

    const { debouncedSubmitting, handleSubmit } = useDebouncedSubmitting({
      isSubmitting,
      onSubmit: innerHandleSubmit(onSubmit),
    });

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
            sx={{ visibility: errors.text ? "visible" : "hidden" }}
          >
            <TbAlertCircle size={30} color={colors.red[7]} />
            <Text color="red">{errors.text?.message}</Text>
          </Flex>
          <Button
            type="submit"
            loading={debouncedSubmitting}
            leftIcon={<MdOutlineInsertComment size={20} />}
            loaderProps={{ size: 20 }}
          >
            送信
          </Button>
        </Flex>
      </form>
    );
  }
);
