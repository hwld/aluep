import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { ZodSchema } from "zod";
import { ThemeTag } from "../../server/models/themeTag";
import { ThemeFormData } from "../../share/schema";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

type Props = {
  allTags: ThemeTag[];
  formSchema: ZodSchema;
  onSubmit: (data: ThemeFormData) => void;
  actionText: string;
  defaultValues?: ThemeFormData;
};

// お題の作成と更新のためのForm
export const ThemeForm: React.FC<Props> = ({
  allTags,
  formSchema,
  onSubmit,
  actionText,
  defaultValues = { title: "", description: "", tags: [] },
}) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThemeFormData>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const handleGoBack = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="md">
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
      </Stack>
      <Flex gap="sm" mt="lg">
        <Button type="submit">{actionText}</Button>
        <Button variant="outline" onClick={handleGoBack}>
          キャンセル
        </Button>
      </Flex>
    </form>
  );
};
