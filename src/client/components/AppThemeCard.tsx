import { Avatar, Badge, Button, Card, Flex, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";

type Props = { theme: Theme };
export const AppThemeCard: React.FC<Props> = ({ theme }) => {
  const router = useRouter();
  const { session } = useSessionQuery();
  const queryClient = useQueryClient();

  const deleteThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["delete"]) => {
      return trpc.theme.delete.mutate(data);
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
    <Card
      shadow="sm"
      withBorder
      key={theme.id}
      sx={(theme) => ({
        transition: "background-color 200ms",
        "&:hover": { backgroundColor: theme.colors.gray[1] },
      })}
      onClick={handleGoDetail}
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
  );
};
