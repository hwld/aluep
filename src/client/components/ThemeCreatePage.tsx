import { Box, Button, Card, Flex, Stack, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { trpc } from "../../client/trpc";
import { RouterInputs } from "../../server/trpc";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

export const ThemeCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createMutate = useMutation({
    mutationFn: (data: RouterInputs["theme"]["create"]) => {
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

  const handleCreateTheme = () => {
    createMutate.mutate({ title, description, tags });
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
          {/* TODO: タグの実装をどうする？ */}
          <AppMultiSelect
            data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
            onChange={(values) => setTags(values)}
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
          <Button onClick={handleCreateTheme}>投稿する</Button>
          <Button variant="outline" onClick={handleBack}>
            キャンセル
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
