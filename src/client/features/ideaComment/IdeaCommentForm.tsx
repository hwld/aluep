import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Textarea } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { MouseEventHandler } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";

type Props = {
  ideaId: string;
  onSubmit: (data: OmitStrict<IdeaCommentFormData, "ideaId">) => void;
  onClickSubmitButton?: MouseEventHandler<HTMLButtonElement>;
  isSubmitting?: boolean;
};

export const IdeaCommentForm: React.FC<Props> = ({
  ideaId,
  onSubmit,
  onClickSubmitButton,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<IdeaCommentFormData>({
    defaultValues: { ideaId, comment: "" },
    resolver: zodResolver(ideaCommentFormSchema),
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
            <Textarea
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
