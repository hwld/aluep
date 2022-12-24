import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
import { ThemeJoinFormData, themeJoinFormSchema } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { AppForm } from "./AppForm";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";
import { RepoCreateModalButton } from "./RepoCreateModalButton";

type Props = {
  defaultValues?: OmitStrict<ThemeJoinFormData, "themeId">;
  themeId: string;
  onSubmit: (data: ThemeJoinFormData) => void;
  onCancel: () => void;
  submitText: string;
  isSubmitting?: boolean;
};
export const ThemeJoinForm: React.FC<Props> = ({
  themeId,
  defaultValues = { comment: "", githubUrl: "" },
  onSubmit,
  onCancel,
  submitText,
  isSubmitting,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ThemeJoinFormData>({
    defaultValues: { ...defaultValues, themeId },
    resolver: zodResolver(themeJoinFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitIcon={MdComputer}
      submitText={submitText}
      isSubmitting={isSubmitting}
    >
      <Flex align="end" gap={5}>
        <Box sx={{ flexGrow: 1 }}>
          <Controller
            name="githubUrl"
            control={control}
            render={({ field }) => {
              return (
                <AppTextInput
                  required
                  label="開発に使用するGitHubリポジトリ"
                  error={errors.githubUrl?.message}
                  rightSection={
                    <RepoCreateModalButton
                      width={70}
                      onSetRepositoryUrl={field.onChange}
                      themeId={themeId}
                    />
                  }
                  rightSectionWidth={70}
                  {...field}
                />
              );
            }}
          />
        </Box>
      </Flex>
      <Controller
        control={control}
        name="comment"
        render={({ field }) => (
          <AppTextarea
            label="コメント"
            minRows={5}
            error={errors.comment?.message}
            {...field}
          />
        )}
      />
    </AppForm>
  );
};
