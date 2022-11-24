import { Box, Button, List, Mark, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { trpc } from "../trpc";

export const UserDeletepage: React.FC = () => {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      return trpc.me.delete.mutate();
    },
    onSuccess: () => {
      // TODO
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "ユーザー削除",
        message: "ユーザーを削除できませんでした。",
      });
    },
  });

  const handleDeleteUser = async () => {
    deleteMutation.mutate();
  };

  return (
    <Box w={600} m="auto">
      <Title>ユーザーの削除</Title>
      <Box mt="xl">
        <Text>一度ユーザーを削除すると、</Text>
        <List
          ml="sm"
          my="sm"
          styles={(theme) => ({ item: { color: theme.colors.gray[7] } })}
        >
          <List.Item>投稿したお題</List.Item>
          <List.Item>お題への参加状況</List.Item>
          <List.Item>ユーザーの情報</List.Item>
        </List>
        <Text>
          が
          <Mark
            sx={(theme) => ({
              color: theme.colors.red[5],
              backgroundColor: "transparent",
            })}
          >
            削除され、復元することはできません。
          </Mark>
        </Text>
        <Box
          mt="xl"
          w="100%"
          h={120}
          sx={(theme) => ({
            backgroundColor: theme.fn.rgba(theme.colors.red[7], 0.15),
            borderRadius: theme.radius.md,
            display: "grid",
            placeItems: "center",
          })}
        >
          <Button color={"red"} onClick={handleDeleteUser}>
            ユーザーを削除する
          </Button>
        </Box>
      </Box>
    </Box>
  );
};