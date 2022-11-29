import { Box, Button, Card, Flex, Stack, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { RouterInputs } from "../../server/trpc";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { trpc } from "../trpc";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

export const ThemeEditPage: React.FC = () => {
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);
  const { allTags } = useAllTagsQuery();

  const [title, setTitle] = useState(theme?.title ?? "");
  const [description, setDescription] = useState(theme?.description ?? "");
  const [tags, setTags] = useState(theme?.tags.map(({ id }) => id) ?? []);

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["update"]) => {
      return trpc.theme.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "お題の更新",
        message: "お題を更新しました。",
      });
      router.push("/");
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の更新",
        message: "お題を更新できませんでした。",
      });
    },
  });

  const handleUpdateTheme = () => {
    if (!theme) {
      return;
    }
    updateMutation.mutate({ themeId: theme.id, title, description, tags });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box w={800} m="auto">
      <Title>お題の投稿</Title>
      <Card mt="xl">
        <Stack spacing="md">
          <AppTextInput
            label="タイトル"
            value={title}
            onChange={({ target: { value } }) => setTitle(value)}
          />
          <AppMultiSelect
            data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
            onChange={(values) => {
              setTags(values);
            }}
            value={tags}
            label="タグ"
            searchable
            nothingFound="タグが見つかりませんでした"
          />
          <AppTextarea
            label="説明"
            autosize
            minRows={10}
            value={description}
            onChange={({ target: { value } }) => setDescription(value)}
          />
        </Stack>
        <Flex gap="sm" mt="lg">
          <Button onClick={handleUpdateTheme}>更新する</Button>
          <Button variant="outline" onClick={handleBack}>
            キャンセル
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
