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
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { trpc } from "../../client/trpc";
import { RouterInputs } from "../../server/trpc";

export const ThemeCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createMutate = useMutation({
    mutationFn: (data: RouterInputs["themes"]["create"]) => {
      return trpc.themes.create.mutate(data);
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
        onChange={(values) => setTags(values)}
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
      <Button mt={10} onClick={handleCreateTheme}>
        投稿
      </Button>
    </Box>
  );
};
