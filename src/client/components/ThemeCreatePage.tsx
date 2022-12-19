import { Box, Card, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { trpc } from "../../client/trpc";
import { ThemeFormData } from "../../share/schema";
import { ThemeForm } from "./ThemeForm";

export const ThemeCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();
  const router = useRouter();

  const createMutate = useMutation({
    mutationFn: (data: ThemeFormData) => {
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

  const handleCreateTheme = (data: ThemeFormData) => {
    createMutate.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box w={800} m="auto">
      <Title order={3}>お題の投稿</Title>
      <Card mt="md">
        <ThemeForm
          actionText="投稿する"
          onSubmit={handleCreateTheme}
          onCancel={handleCancel}
          allTags={allTags}
          isSubmitting={createMutate.isLoading}
        />
      </Card>
    </Box>
  );
};
