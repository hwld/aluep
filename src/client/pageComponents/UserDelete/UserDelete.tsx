import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { ReCaptchaCheckBox } from "@/client/ui/ReCaptchaCheckBox";
import { Routes } from "@/share/routes";
import { Box, Button, List, Mark, Text, Title } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export const UserDelete: React.FC = () => {
  const router = useRouter();

  const [reCaptchaToken, setReCaptchaToken] = useState<string | undefined>(
    undefined
  );

  const disableDeleteButton = reCaptchaToken === undefined;

  const queryClient = useQueryClient();
  const deleteMutation = useMutationWithNotification(trpc.me.delete, {
    errorNotification: {
      title: "ユーザーの削除",
      message: "ユーザーを削除できませんでした。",
    },
    onMutate: () => {
      queryClient.clear();
    },
    onSuccess: () => {
      router.replace(Routes.home);
    },
  });

  const handleDeleteUser = () => {
    if (reCaptchaToken === undefined) {
      return;
    }
    deleteMutation.mutate({ reCaptchaToken });
  };

  return (
    <>
      <PageHeader icon={IconTrash} pageName="アカウントの削除" />
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
              style={(theme) => ({
                color: theme.colors.red[5],
                backgroundColor: "transparent",
              })}
            >
              削除され、復元することはできません。
            </Mark>
          </Text>
          <Title order={3} mt="lg" mb="md">
            チェックを入れてユーザーを削除する
          </Title>
          <ReCaptchaCheckBox onCheck={setReCaptchaToken} />
          <Box
            mt={50}
            w="100%"
            h={120}
            style={(theme) => ({
              backgroundColor: theme.colors.red[1],
              borderRadius: theme.radius.md,
              border: "2px solid var(--mantine-color-red-3)",
              display: "grid",
              placeItems: "center",
            })}
          >
            <Box style={{ textAlign: "center" }}>
              <Button
                color="red"
                onClick={handleDeleteUser}
                disabled={disableDeleteButton}
              >
                ユーザーを削除する
              </Button>
              {disableDeleteButton && (
                <Text mt="xs" size="sm">
                  チェックボックスにチェックを入れてください
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
