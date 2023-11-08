import { useDevMemos } from "@/client/features/devMemo/useDevMemos";
import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import { DevMemoFormData, devMemoFormSchema } from "@/models/devMemo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconMessage2 } from "@tabler/icons-react";
import clsx from "clsx";
import { User } from "next-auth";
import { forwardRef, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import classes from "./DevMemoFormCard.module.css";

type Props = {
  devId: string;
  loggedInUser: User;
};
export const DevMemoFormCard = forwardRef<HTMLDivElement, Props>(
  function DevMemoFormCard({ devId, loggedInUser }, ref) {
    const {
      control,
      formState: { errors },
      handleSubmit: innerHandleSubmit,
      reset,
    } = useForm<DevMemoFormData>({
      defaultValues: { text: "" },
      resolver: zodResolver(devMemoFormSchema),
    });

    const { createMemoMutation } = useDevMemos({ devId });
    const { debouncedSubmitting, handleSubmit } = useDebouncedSubmitting({
      isSubmitting: createMemoMutation.isLoading,
      onSubmit: innerHandleSubmit((data) => {
        createMemoMutation.mutate(
          { ...data, devId },
          {
            onSuccess: () => {
              reset();
            },
          }
        );
      }),
    });

    const memoRef = useRef<HTMLTextAreaElement | null>(null);
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
            <MutedText truncate>{loggedInUser.name}</MutedText>
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
