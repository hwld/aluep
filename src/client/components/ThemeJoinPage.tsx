import { Avatar, Box, Card, Flex, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { ThemeJoinFormData } from "../../share/schema";
import { useThemeJoin } from "../hooks/useThemeJoin";
import { ThemeJoinForm } from "./ThemeJoinForm";
import { ThemeTagBadge } from "./ThemeTagBadge";

type Props = { theme: Theme };
export const ThemeJoinPage: React.FC<Props> = ({ theme }) => {
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
    <Box w={800} m="auto">
      <Title order={3}>お題へ参加</Title>
      <Card mt="md">
        <Title order={4}>{theme.title}</Title>
        <Flex mt="md" gap={5}>
          <Avatar
            src={theme.user.image}
            size="md"
            radius={100}
            sx={(theme) => ({
              borderWidth: "2px",
              borderColor: theme.colors.gray[2],
              borderStyle: "solid",
              borderRadius: "100%",
            })}
          />
          <Text size="sm">{theme.user.name}</Text>
        </Flex>
        <Flex gap={10} mt="sm" wrap="wrap">
          {theme.tags.map((tag) => {
            return <ThemeTagBadge key={tag.id}>{tag.name}</ThemeTagBadge>;
          })}
        </Flex>
      </Card>
      <Card mt="xl">
        <ThemeJoinForm
          onSubmit={handleJoinTheme}
          onCancel={handleBack}
          themeId={theme.id}
          actionText="参加する"
          isSubmitting={joinMutation.isLoading}
        />
      </Card>
    </Box>
  );
};
