import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Textarea } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import {
  IdeaCommentFormData,
  ideaCommentFormSchema,
} from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { useDebouncedSubmitting } from "../../lib/useDebouncedSubmitting";

type Props = {
  inReplyToCommentId: string;
  ideaId: string;
  onSubmit: (data: OmitStrict<IdeaCommentFormData, "ideaId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const IdeaCommentReplyForm: React.FC<Props> = ({
  ideaId,
  inReplyToCommentId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit: innerHandleSubmit,
    formState: { errors },
  } = useForm<IdeaCommentFormData>({
    defaultValues: { ideaId, inReplyToCommentId, comment: "" },
    resolver: zodResolver(ideaCommentFormSchema),
  });

  const { debouncedSubmitting, handleSubmit, handleCancel } =
    useDebouncedSubmitting({
      isSubmitting,
      onCancel,
      onSubmit: innerHandleSubmit(onSubmit),
    });

  return (
    <form onSubmit={handleSubmit}>
      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <Textarea
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
          onClick={handleCancel}
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
