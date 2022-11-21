import {
  Box,
  Button,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { RouterInputs } from "../../server/trpc";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { trpc } from "../trpc";

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
    mutationFn: (data: RouterInputs["themes"]["update"]) => {
      return trpc.themes.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "お題の更新",
        message: "お題を更新しました。",
      });
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

  return (
    <Box p={30}>
      <Text fw={700} size={32} component="h1">
        お題の投稿
      </Text>
      <TextInput
        label="タイトル"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
      />
      {/* TODO: タグの実装をどうする？ */}
      <MultiSelect
        data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
        onChange={(values) => {
          setTags(values);
        }}
        value={tags}
        label="タグ"
        searchable
        nothingFound="タグが見つかりませんでした"
      />
      <Textarea
        label="説明"
        autosize
        minRows={10}
        mt={10}
        value={description}
        onChange={({ target: { value } }) => setDescription(value)}
      />
      <Button mt={10} onClick={handleUpdateTheme}>
        更新
      </Button>
    </Box>
  );
};
