import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import {
  DevelopmentMemoFormData,
  developmentMemoFormSchema,
} from "@/models/developmentMemo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Flex, Text } from "@mantine/core";
import clsx from "clsx";
import { User } from "next-auth";
import { forwardRef, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import { TbAlertCircle } from "react-icons/tb";
import classes from "./DevMemoFormCard.module.css";

type Props = {
  developmentId: string;
  onSubmit: (data: DevelopmentMemoFormData) => void;
  isSubmitting?: boolean;
  loggedInUser: User;
};
export const DevMemoFormCard = forwardRef<HTMLDivElement, Props>(
  function DevelopmentMemoFormCard(
    { developmentId, onSubmit, isSubmitting = false, loggedInUser },
    ref
  ) {
    const memoRef = useRef<HTMLTextAreaElement | null>(null);

    const {
      control,
      formState: { errors },
      handleSubmit: innerHandleSubmit,
    } = useForm<DevelopmentMemoFormData>({
      defaultValues: { text: "" },
      resolver: zodResolver(developmentMemoFormSchema),
    });

    const { debouncedSubmitting, handleSubmit } = useDebouncedSubmitting({
      isSubmitting,
      onSubmit: innerHandleSubmit(onSubmit),
    });

    const handleFocusTextarea = () => {
      if (memoRef.current) {
        memoRef.current.focus();
      }
    };

    return (
      <Card ref={ref} onClick={handleFocusTextarea}>
        <form onSubmit={handleSubmit}>
          <Flex align="center" gap="xs">
            <UserIcon iconSrc={loggedInUser.image} />
            <Text truncate size="xs" c="gray.5">
              {loggedInUser.name}
            </Text>
          </Flex>
          <Controller
            control={control}
            name="text"
            render={({ field }) => {
              return (
                <PlainTextarea
                  mt="xs"
                  placeholder="メモを投稿する"
                  autosize
                  minRows={5}
                  error={errors.text !== undefined}
                  {...field}
                  ref={(e) => {
                    field.ref(e);
                    memoRef.current = e;
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
              <TbAlertCircle size={30} color="var(--mantine-color-red-7)" />
              <Text c="red">{errors.text?.message}</Text>
            </Flex>
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
              送信
            </Button>
          </Flex>
        </form>
      </Card>
    );
  }
);
