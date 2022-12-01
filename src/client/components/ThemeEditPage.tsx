import { Box, Card, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { RouterInputs } from "../../server/trpc";
import { ThemeFormData } from "../../share/schema";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { trpc } from "../trpc";
import { ThemeForm } from "./ThemeForm";

type Props = { theme: Theme };
export const ThemeEditPage: React.FC<Props> = ({ theme }) => {
  const router = useRouter();
  const { allTags } = useAllTagsQuery();

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

  const handleUpdateTheme = (data: ThemeFormData) => {
    updateMutation.mutate({ ...data, themeId: theme.id });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box w={800} m="auto">
      <Title>お題の投稿</Title>
      <Card mt="xl">
        <ThemeForm
          actionText="更新する"
          allTags={allTags}
          onSubmit={handleUpdateTheme}
          onCancel={handleCancel}
          defaultValues={{ ...theme, tags: theme?.tags.map((t) => t.id) ?? [] }}
        />
      </Card>
    </Box>
  );
};
