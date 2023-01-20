import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { MouseEventHandler } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import {
  ThemeCommentFormData,
  themeCommentFormSchema,
} from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { AppTextarea } from "./AppTextarea";

type Props = {
  themeId: string;
  onSubmit: (data: OmitStrict<ThemeCommentFormData, "themeId">) => void;
  onClickSubmitButton?: MouseEventHandler<HTMLButtonElement>;
  isSubmitting?: boolean;
};

export const ThemeCommentForm: React.FC<Props> = ({
  themeId,
  onSubmit,
  onClickSubmitButton,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<ThemeCommentFormData>({
    defaultValues: { themeId, comment: "" },
    resolver: zodResolver(themeCommentFormSchema),
  });

  const [debouncedSubmitting] = useDebouncedValue(isSubmitting, 250);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    innerHandleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <AppTextarea
              placeholder="コメントする"
              autosize
              minRows={5}
              error={errors.comment?.message}
              {...field}
            />
          );
        }}
      />
      <Flex mt="xs" justify="flex-end">
        <Button
          type="submit"
          loading={debouncedSubmitting}
          leftIcon={<MdOutlineInsertComment size={20} />}
          loaderProps={{ size: 20 }}
          onClick={onClickSubmitButton}
        >
          送信
        </Button>
      </Flex>
    </form>
  );
};
