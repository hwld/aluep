import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineInsertComment } from "react-icons/md";
import {
  ThemeCommentFormData,
  themeCommentFormSchema,
} from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { AppForm } from "./AppForm";
import { AppTextarea } from "./AppTextarea";

type Props = {
  onSubmit: (data: OmitStrict<ThemeCommentFormData, "themeId">) => void;
  onCancel: () => void;
  submitText: string;
  isSubmitting?: boolean;
};

export const ThemeCommentForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  submitText,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThemeCommentFormData>({
    resolver: zodResolver(themeCommentFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitIcon={MdOutlineInsertComment}
      submitText={submitText}
      isSubmitting={isSubmitting}
    >
      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <AppTextarea
              autosize
              minRows={5}
              error={errors.comment?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
