import { Button, Stack, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useRequireLoginModal } from "../contexts/RequireLoginModalProvider";
import { AppModal } from "./AppModal";

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
    >
      <Stack>
        <Text>この機能を利用するためには、ログインをする必要があります。</Text>
        <Button leftIcon={<FaGithub size="21" />} onClick={handleLogin}>
          GitHubでログイン
        </Button>
      </Stack>
    </AppModal>
  );
};
