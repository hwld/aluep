import { Card, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { ThemeJoinFormData } from "../../share/schema";
import { useThemeJoin } from "../hooks/useThemeJoin";
import { ThemeJoinForm } from "./ThemeJoinForm";
import { ThemeSummaryCard } from "./ThemeSummaryCard";

type Props = { theme: Theme; repoUrl?: string };
export const ThemeJoinPage: React.FC<Props> = ({ theme, repoUrl }) => {
  const router = useRouter();

  const {
    mutations: { joinMutation },
  } = useThemeJoin(theme.id);

  const handleJoinTheme = (data: ThemeJoinFormData) => {
    joinMutation.mutate(data, {
      onSuccess: () => router.replace(`/themes/${theme.id}`),
    });
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <Stack w={800} m="auto" spacing="lg">
      <Title order={3}>お題へ参加</Title>
      <Stack spacing="xs">
        <Text c="gray.5">参加するお題</Text>
        <ThemeSummaryCard theme={theme} />
      </Stack>
      <Stack spacing="xs">
        <Text c="gray.5">開発情報</Text>
        <Card>
          <ThemeJoinForm
            onSubmit={handleJoinTheme}
            onCancel={handleBack}
            themeId={theme.id}
            submitText="参加する"
            isSubmitting={joinMutation.isLoading}
            defaultValues={{ githubUrl: repoUrl ?? "", comment: "" }}
          />
        </Card>
      </Stack>
    </Stack>
  );
};
