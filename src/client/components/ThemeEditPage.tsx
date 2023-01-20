import { Box, Card, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { RouterInputs } from "../../server/trpc";
import { ThemeFormData } from "../../share/schema";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
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
      showSuccessNotification({
        title: "お題の更新",
        message: "お題を更新しました。",
      });
      router.push(`/themes/${theme.id}`);
    },
    onError: () => {
      showErrorNotification({
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
      <Title order={3}>お題の更新</Title>
      <Card mt="md">
        <ThemeForm
          submitText="更新する"
          allTags={allTags}
          onSubmit={handleUpdateTheme}
          onCancel={handleCancel}
          defaultValues={{ ...theme, tags: theme?.tags.map((t) => t.id) ?? [] }}
          isLoading={updateMutation.isLoading || updateMutation.isSuccess}
        />
      </Card>
    </Box>
  );
};
