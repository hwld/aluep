import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Divider,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import { TbAlertCircle } from "react-icons/tb";
import { User } from "../../../server/models/user";
import {
  DevelopmentMemoFormData,
  developmentMemoFormSchema,
} from "../../../share/schema";
import { useDebouncedSubmitting } from "../../lib/useDebouncedSubmitting";
import { PlainTextarea } from "../../ui/PlainTextarea";
import { UserIcon } from "../user/UserIcon";

type Props = {
  developmentId: string;
  onSubmit: (data: DevelopmentMemoFormData) => void;
  isSubmitting?: boolean;
  loggedInUser: User;
};
export const DevelopmentMemoFormCard: React.FC<Props> = ({
  developmentId,
  onSubmit,
  isSubmitting = false,
  loggedInUser,
}) => {
  const { colors } = useMantineTheme();
  const memoRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit: innerHandleSubmit,
  } = useForm<DevelopmentMemoFormData>({
    defaultValues: { developmentId, memo: "" },
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
    <Card onClick={handleFocusTextarea}>
      <form onSubmit={handleSubmit}>
        <Flex align="center" gap="xs">
          <UserIcon iconSrc={loggedInUser.image} />
          <Text>{loggedInUser.name}</Text>
        </Flex>
        <Controller
          control={control}
          name="memo"
          render={({ field }) => {
            return (
              <PlainTextarea
                mt="xs"
                placeholder="メモを投稿する"
                autosize
                minRows={5}
                error={errors.memo !== undefined}
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
            sx={{ visibility: errors.memo ? "visible" : "hidden" }}
          >
            <TbAlertCircle size={30} color={colors.red[7]} />
            <Text color="red">{errors.memo?.message}</Text>
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
    </Card>
  );
};
