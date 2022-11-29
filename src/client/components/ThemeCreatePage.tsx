import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, Stack, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { trpc } from "../../client/trpc";
import { ThemeCreateInput, themeCreateInputSchema } from "../../share/schema";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

export const ThemeCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThemeCreateInput>({
    defaultValues: { title: "", description: "", tags: [] },
    resolver: zodResolver(themeCreateInputSchema),
  });
  console.log(errors);

  const createMutate = useMutation({
    mutationFn: (data: ThemeCreateInput) => {
      return trpc.theme.create.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "投稿",
        message: "お題を投稿しました。",
      });
      router.replace("/");
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "投稿",
        message: "お題が投稿できませんでした。",
      });
    },
  });

  const handleCreateTheme = (data: ThemeCreateInput) => {
    createMutate.mutate(data);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box w={800} m="auto">
      <Title>お題の投稿</Title>
      <Card mt="xl">
        <form onSubmit={handleSubmit(handleCreateTheme)}>
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
            {/* <Button onClick={handleCreateTheme}>投稿する</Button> */}
            <Button type="submit">投稿する</Button>
            <Button variant="outline" onClick={handleBack}>
              キャンセル
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};
