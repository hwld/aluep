import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Textarea, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
import {
  ThemeDevelopFormData,
  themeDevelopFormSchema,
} from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { AppForm } from "../../ui/AppForm";

type Props = {
  defaultValues?: OmitStrict<ThemeDevelopFormData, "themeId">;
  isLoading?: boolean;
  themeId: string;
  onSubmit: (data: ThemeDevelopFormData) => void;
  onCancel: () => void;
  submitText: string;
};

export const ThemeDevelopAlreadyRepoForm: React.FC<Props> = ({
  defaultValues = { githubUrl: "", message: "" },
  themeId,
  onSubmit,
  onCancel,
  submitText,
  isLoading,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ThemeDevelopFormData>({
    defaultValues: { ...defaultValues, themeId },
    resolver: zodResolver(themeDevelopFormSchema),
  });
  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitIcon={MdComputer}
      submitText={submitText}
      isSubmitting={isLoading}
    >
      <Flex align="end" gap={5}>
        <Box sx={{ flexGrow: 1 }}>
          <Controller
            name="githubUrl"
            control={control}
            render={({ field }) => {
              return (
                <TextInput
                  required
                  label="開発に使用するGitHubリポジトリ"
                  error={errors.githubUrl?.message}
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
          <Textarea
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
