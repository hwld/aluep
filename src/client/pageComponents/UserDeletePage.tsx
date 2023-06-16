import { Box, Button, List, Mark, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { TbTrash } from "react-icons/tb";
import { Routes } from "../../share/routes";
import { trpc } from "../lib/trpc";
import { showErrorNotification } from "../lib/utils";
import { PageHeader } from "../ui/PageHeader";

export const UserDeletepage: React.FC = () => {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      return trpc.me.delete.mutate();
    },
    onSuccess: () => {
      router.replace(Routes.home);
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
    <>
      <PageHeader icon={TbTrash} pageName="アカウントの削除" />
      <Box w="100%" maw={600} m="auto">
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
            <Button color="red" onClick={handleDeleteUser}>
              ユーザーを削除する
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
