import { Box, Button, Card, Flex, Stack, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";
import { AppTextInput } from "./AppTextInput";

export const UserEditPage: React.FC = () => {
  const router = useRouter();

  const { session } = useSessionQuery();
  const [name, setName] = useState(session?.user?.name || "");

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["me"]["update"]) => {
      return trpc.me.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新しました。",
        color: "green",
      });
    },
    onError: () => {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新できませんでした。",
        color: "red",
      });
    },
  });

  const handleUpdateUser = () => {
    updateMutation.mutate({ name });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box w={800} m="auto">
      <Title>プロフィールの更新</Title>
      <Card mt="xl">
        <Stack spacing="md">
          <AppTextInput
            label="ユーザー名"
            value={name}
            onChange={({ target: { value } }) => {
              setName(value);
            }}
          />
        </Stack>
        <Flex gap={10} mt="lg">
          <Button onClick={handleUpdateUser}>更新する</Button>
          <Button variant="outline" onClick={handleBack}>
            キャンセル
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
