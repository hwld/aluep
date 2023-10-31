import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { useDebouncedSubmitting } from "@/client/lib/useDebouncedSubmitting";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PlainTextarea } from "@/client/ui/PlainTextarea/PlainTextarea";
import { DevMemoFormData, devMemoFormSchema } from "@/models/devMemo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Flex, Text } from "@mantine/core";
import { SvgAlertCircle, SvgMessage2 } from "@tabler/icons-react";
import clsx from "clsx";
import { User } from "next-auth";
import { forwardRef, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import classes from "./DevMemoFormCard.module.css";

type Props = {
  onSubmit: (data: DevMemoFormData) => void;
  isSubmitting?: boolean;
  loggedInUser: User;
};
export const DevMemoFormCard = forwardRef<HTMLDivElement, Props>(
  function DevMemoFormCard(
    { onSubmit, isSubmitting = false, loggedInUser },
    ref
  ) {
    const memoRef = useRef<HTMLTextAreaElement | null>(null);

    const {
      control,
      formState: { errors },
      handleSubmit: innerHandleSubmit,
    } = useForm<DevMemoFormData>({
      defaultValues: { text: "" },
      resolver: zodResolver(devMemoFormSchema),
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
              <SvgAlertCircle
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
                <SvgMessage2
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
