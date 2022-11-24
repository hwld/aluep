import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { RouterInputs } from "../../server/trpc";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { trpc } from "../trpc";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";
import { RepoCreateModalButton } from "./RepoCreateModalButton";
import { ThemeTagBadge } from "./ThemeTagBadge";

export const ThemeJoinPage: React.FC = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  const [repoUrl, setRepoUrl] = useState("");
  const [comment, setComment] = useState("");

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
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題に参加",
        message: "お題に参加できませんでした。",
      });
    },
  });

  const handleJoinTheme = () => {
    if (!theme) return;
    joinThemeMutation.mutate({
      themeId: theme.id,
      githubUrl: repoUrl,
      comment,
    });
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
        <Stack>
          <Flex align="end" gap={5}>
            <Box sx={{ flexGrow: 1 }}>
              <AppTextInput
                label="GitHubリポジトリ"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                }}
              />
            </Box>
            <RepoCreateModalButton onSetRepositoryUrl={setRepoUrl} />
          </Flex>
          <AppTextarea
            label="コメント"
            minRows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Stack>
        <Flex gap="sm" mt="lg">
          <Button onClick={handleJoinTheme}>参加する</Button>
          <Button variant="outline" onClick={handleBack}>
            キャンセル
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
