import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Flex, Stack } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { ThemeJoinFormData, themeJoinFormSchema } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";
import { RepoCreateModalButton } from "./RepoCreateModalButton";

type Props = {
  defaultValues?: OmitStrict<ThemeJoinFormData, "themeId">;
  themeId: string;
  onSubmit: (data: ThemeJoinFormData) => void;
  onCancel: () => void;
};
export const ThemeJoinForm: React.FC<Props> = ({
  themeId,
  defaultValues = { comment: "", githubUrl: "" },
  onSubmit,
  onCancel,
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        <Flex align="end" gap={5}>
          <Box sx={{ flexGrow: 1 }}>
            <Controller
              name="githubUrl"
              control={control}
              render={({ field }) => {
                return (
                  <AppTextInput
                    required
                    label="GitHubリポジトリ"
                    error={errors.githubUrl?.message}
                    rightSection={
                      <RepoCreateModalButton
                        width={70}
                        onSetRepositoryUrl={field.onChange}
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
      </Stack>
      <Flex gap="sm" mt="lg">
        <Button type="submit">参加する</Button>
        <Button variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
      </Flex>
    </form>
  );
};
