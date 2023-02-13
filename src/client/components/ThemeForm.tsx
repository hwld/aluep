import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { MdPostAdd } from "react-icons/md";
import { ThemeTag } from "../../server/models/themeTag";
import { ThemeFormData, themeFormSchema } from "../../share/schema";
import { AppForm } from "./AppForm";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";
import { ThemeDescriptionEditor } from "./ThemeDescriptionEditor/ThemeDescriptionEditor";
import { useThemeDescriptionEditor } from "./ThemeDescriptionEditor/useThemeDescriptionEditor";

type Props = {
  allTags: ThemeTag[];
  onSubmit: (data: ThemeFormData) => void;
  onCancel: () => void;
  submitText: string;
  defaultValues?: ThemeFormData;
  isLoading?: boolean;
};

// お題の作成と更新のためのForm
export const ThemeForm: React.FC<Props> = ({
  allTags,
  onSubmit,
  onCancel,
  submitText,
  defaultValues = { title: "", description: "", tags: [] },
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThemeFormData>({
    defaultValues,
    resolver: zodResolver(themeFormSchema),
  });

  const editor = useThemeDescriptionEditor(defaultValues.description);

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitText={submitText}
      submitIcon={MdPostAdd}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <AppTextInput
            required
            label="タイトル"
            error={errors.title?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="tags"
        render={({ field }) => {
          return (
            <AppMultiSelect
              data={allTags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              label="タグ"
              searchable
              nothingFound="タグが見つかりませんでした"
              error={errors.tags?.message}
              {...field}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => {
          return (
            <AppTextarea
              required
              label="説明"
              autosize
              minRows={10}
              error={errors.description?.message}
              {...field}
            />
          );
        }}
      />
      <Stack spacing={3}>
        <ThemeDescriptionEditor editor={editor} />
      </Stack>
    </AppForm>
  );
};
