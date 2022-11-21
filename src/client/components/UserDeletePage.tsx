import { Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { trpc } from "../trpc";

export const UserDeletepage: React.FC = () => {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      return trpc.users.me.delete.mutate();
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
    <>
      <Text>ユーザー削除</Text>
      <Button variant="light" color={"red"} onClick={handleDeleteUser}>
        ユーザーを削除する
      </Button>
    </>
  );
};
