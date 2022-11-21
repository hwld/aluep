import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { AppThemeWithUserWithTags } from "../../server/routers/themes";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";

type Props = { theme: AppThemeWithUserWithTags };
export const AppThemeCard: React.FC<Props> = ({ theme }) => {
  const router = useRouter();
  const { session } = useSessionQuery();
  const queryClient = useQueryClient();

  const deleteThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["themes"]["delete"]) => {
      return trpc.themes.delete.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["themes"]);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const handleGoDetail = () => {
    router.push(`/themes/${theme.id}`);
  };

  const handleDeleteTheme = (id: string) => {
    deleteThemeMutation.mutate({ themeId: id });
  };

  return (
    <UnstyledButton onClick={handleGoDetail}>
      <Card
        shadow="sm"
        withBorder
        key={theme.id}
        sx={(theme) => ({
          transition: "background-color 200ms",
          "&:hover": { backgroundColor: theme.colors.gray[1] },
        })}
      >
        {/* ヘッダ */}
        <Flex justify="space-between" align="center">
          <Title order={3}>{theme.title}</Title>
          <Flex gap={5}>
            {session?.user.id === theme.user.id && (
              <>
                <Button
                  component={Link}
                  href={`/themes/${theme.id}/update`}
                  variant="outline"
                >
                  更新
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteTheme(theme.id);
                  }}
                  variant="outline"
                >
                  削除
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        {/* ユーザー情報 */}
        <Flex align="center" justify="space-between">
          <Flex gap={10} align="center">
            <Avatar src={theme.user.image} radius="xl" size="md" />
            <Text>{theme.user.name}</Text>
          </Flex>
          <Text>{new Date(theme.createdAt).toLocaleString()}</Text>
        </Flex>

        {/* タグ */}
        <Flex gap={5} wrap="wrap" mt={15}>
          {theme.tags.map((tag) => {
            return (
              <Badge sx={{ textTransform: "none" }} key={tag.id}>
                {tag.name}
              </Badge>
            );
          })}
        </Flex>
      </Card>
    </UnstyledButton>
  );
};
