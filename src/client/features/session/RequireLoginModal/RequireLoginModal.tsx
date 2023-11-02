import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { Button, Center, Flex, Stack, Text } from "@mantine/core";
import { IconBrandGithub, IconLogin2 } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

type Props = {};
export const RequireLoginModal: React.FC<Props> = () => {
  const { isLoginModalOpen, closeLoginModal, callbackUrlAfterLogin } =
    useRequireLoginModal();

  const handleLogin = () => {
    signIn("github", { callbackUrl: callbackUrlAfterLogin });
  };

  return (
    <AppModal
      centered
      opened={isLoginModalOpen}
      onClose={closeLoginModal}
      title="ログイン"
      size="lg"
    >
      <Flex gap="xl" pt={0} p="lg">
        <Stack style={{ flex: 1 }} mt="xl" justify="center" gap="xl">
          <Text>
            この機能を利用するためには、GitHubアカウントでログインする必要があります。
          </Text>
          <Button
            leftSection={<IconBrandGithub width={21} height={21} />}
            onClick={handleLogin}
          >
            GitHubでログイン
          </Button>
        </Stack>
        <Center
          w={300}
          h={300}
          bg="gray.2"
          style={{ borderRadius: "var(--mantine-radius-lg)" }}
        >
          <IconLogin2
            size="80%"
            stroke={1.4}
            color="var(--mantine-color-red-7)"
          />
        </Center>
      </Flex>
    </AppModal>
  );
};
