import { Avatar, Box, Card, Flex, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { RouterInputs } from "../../server/trpc";
import { ThemeJoinFormData } from "../../share/schema";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { trpc } from "../trpc";
import { ThemeJoinForm } from "./ThemeJoinForm";
import { ThemeTagBadge } from "./ThemeTagBadge";

export const ThemeJoinPage: React.FC = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  const joinThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["join"]) => {
      return trpc.theme.join.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "お題に参加",
        message: "お題に参加しました。",
      });
      router.back();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題に参加",
        message: "お題に参加できませんでした。",
      });
    },
  });

  const handleJoinTheme = (data: ThemeJoinFormData) => {
    joinThemeMutation.mutate(data);
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <Box w={800} m="auto">
      <Title>お題へ参加</Title>
      <Card mt="xl">
        <Title order={3}>{theme?.title}</Title>
        <Flex mt="md" gap={5}>
          <Avatar
            src={theme?.user.image}
            size="md"
            radius={100}
            sx={(theme) => ({
              borderWidth: "2px",
              borderColor: theme.colors.gray[2],
              borderStyle: "solid",
              borderRadius: "100%",
            })}
          />
          <Text>{theme?.user.name}</Text>
        </Flex>
        <Flex gap={10} mt="sm">
          {theme?.tags.map((tag) => {
            return <ThemeTagBadge key={tag.id}>{tag.name}</ThemeTagBadge>;
          })}
        </Flex>
      </Card>
      <Card mt="xl">
        <ThemeJoinForm
          onSubmit={handleJoinTheme}
          onCancel={handleBack}
          themeId={themeId}
        />
      </Card>
    </Box>
  );
};
