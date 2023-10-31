import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { Routes } from "@/share/routes";
import { Button, Card, Text } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import { useRouter } from "next/router";
import classes from "./EmptyFomeIdeas.module.css";

type Props = { isLoggedIn: boolean };

export const EmptyHomeIdeas: React.FC<Props> = ({ isLoggedIn }) => {
  const router = useRouter();
  const { openLoginModal } = useRequireLoginModal();

  const handleCreateIdea = () => {
    if (!isLoggedIn) {
      openLoginModal(Routes.ideaCreate);
      return;
    }

    router.push(Routes.ideaCreate);
  };

  return (
    <Card w={450} p="xl" className={classes.root}>
      <IconFileText
        width={100}
        height={100}
        color="var(--mantine-color-red-7)"
      />
      <Text size="lg" c="gray.5" fw="bold" mt="sm">
        お題が投稿されていません
      </Text>
      <Text ta="center" c="gray.4" mt={5}>
        ユーザーによってお題が投稿されると、<br></br>
        人気のお題や最新のお題などが表示されます。
      </Text>
      <Button mt="xl" onClick={handleCreateIdea}>
        お題を投稿する
      </Button>
    </Card>
  );
};
