import { Card, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { RouterInputs } from "../../server/trpc";
import { ThemeJoinFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { ThemeJoinForm } from "./ThemeJoinForm";
import { ThemeSummaryCard } from "./ThemeSummaryCard";

type Props = { theme: Theme; developer: ThemeDeveloper };
export const DeveloperEditPage: React.FC<Props> = ({ theme, developer }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["themeDeveloper"]["update"]) => {
      return trpc.themeDeveloper.update.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "参加情報の更新",
        message: "参加情報を更新しました。",
      });
      queryClient.invalidateQueries(["developers", developer.id]);
      router.push(`/themes/${theme.id}/developers/${developer.id}/detail`);
    },
    onError: () => {
      showErrorNotification({
        title: "参加情報の更新",
        message: "参加情報を更新できませんでした。",
      });
    },
  });

  const handleUpdateDeveloper = (data: ThemeJoinFormData) => {
    updateMutation.mutate(data);
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <Stack w={800} m="auto" spacing="lg">
      <Title order={3}>お題の参加情報の更新</Title>
      <Stack spacing="xs">
        <Text c="gray.5">参加しているお題</Text>
        <ThemeSummaryCard theme={theme} />
      </Stack>
      <Stack spacing="xs">
        <Text c="gray.5">参加情報</Text>
        <Card>
          <ThemeJoinForm
            onSubmit={handleUpdateDeveloper}
            onCancel={handleBack}
            themeId={theme.id}
            defaultValues={developer}
            submitText="更新する"
            isLoading={updateMutation.isLoading || updateMutation.isSuccess}
          />
        </Card>
      </Stack>
    </Stack>
  );
};
