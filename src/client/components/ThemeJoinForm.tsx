import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Flex, Stack } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
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
  actionText: string;
  isSubmitting?: boolean;
};
export const ThemeJoinForm: React.FC<Props> = ({
  themeId,
  defaultValues = { comment: "", githubUrl: "" },
  onSubmit,
  onCancel,
  actionText,
  isSubmitting,
}) => {
  const formId = useId();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ThemeJoinFormData>({
    defaultValues: { ...defaultValues, themeId },
    resolver: zodResolver(themeJoinFormSchema),
  });

  const [debouncedSubmitting] = useDebouncedValue(isSubmitting, 250);

  return (
    <>
      {/* formがネストしないようにidで紐づける */}
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate />
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
        <Button
          type="submit"
          form={formId}
          loading={debouncedSubmitting}
          leftIcon={<MdComputer size={20} />}
          loaderProps={{ size: 20 }}
        >
          {actionText}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={debouncedSubmitting}
        >
          キャンセル
        </Button>
      </Flex>
    </>
  );
};
