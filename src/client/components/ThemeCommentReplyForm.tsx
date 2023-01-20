import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import {
  ThemeCommentFormData,
  themeCommentFormSchema,
} from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { AppTextarea } from "./AppTextarea";

type Props = {
  inReplyToCommentId: string;
  themeId: string;
  onSubmit: (data: OmitStrict<ThemeCommentFormData, "themeId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const ThemeCommentReplyForm: React.FC<Props> = ({
  themeId,
  inReplyToCommentId,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<ThemeCommentFormData>({
    defaultValues: { themeId, inReplyToCommentId, comment: "" },
    resolver: zodResolver(themeCommentFormSchema),
  });

  const [debouncedSubmitting] = useDebouncedValue(isSubmitting, 250);

  return (
    <form onSubmit={innerHandleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <AppTextarea
              placeholder="コメントに返信する"
              autosize
              minRows={5}
              error={errors.comment?.message}
              {...field}
            />
          );
        }}
      />
      <Flex mt="xs" justify="flex-end" gap="sm">
        <Button
          variant="outline"
          onClick={onCancel}
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
    </form>
  );
};
