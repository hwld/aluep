import { Box, Button, List, Mark, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { trpc } from "../trpc";
import { showErrorNotification } from "../utils";

export const UserDeletepage: React.FC = () => {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      return trpc.me.delete.mutate();
    },
    onSuccess: () => {
      router.replace("/");
    },
    onError: () => {
      showErrorNotification({
        title: "ユーザーの削除",
        message: "ユーザーを削除できませんでした。",
      });
    },
  });

  const handleDeleteUser = () => {
    deleteMutation.mutate();
  };

  return (
    <Box w="100%" maw={600} m="auto">
      <Title order={3}>ユーザーの削除</Title>
      <Box mt="xl">
        <Text>一度ユーザーを削除すると、</Text>
        <List
          ml="sm"
          my="sm"
          styles={(theme) => ({ item: { color: theme.colors.gray[7] } })}
        >
          <List.Item>投稿したお題</List.Item>
          <List.Item>お題への開発状況</List.Item>
          <List.Item>ユーザーの情報</List.Item>
        </List>
        <Text>
          などが
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
          mt={50}
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
