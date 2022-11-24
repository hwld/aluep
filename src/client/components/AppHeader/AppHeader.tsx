import { Flex, Header, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AppHeaderButton } from "./AppHeaderButton";
import { UserMenuButton } from "./UserMenuButton";

type Props = { user?: Session["user"] };

export const AppHeader: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  const handleCreateTheme = () => {
    router.push("/themes/create");
  };

  const handleLogIn = () => {
    signIn("github");
  };

  return (
    <Header
      height={60}
      p="xs"
      px={30}
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.red[7],
      })}
    >
      <Text fw={700} color="gray.1" size={22} component={Link} href="/">
        AppThemePost
      </Text>
      {user ? (
        <Flex gap={10} align="center">
          <AppHeaderButton onClick={handleCreateTheme}>
            お題を投稿する
          </AppHeaderButton>
          <UserMenuButton user={user} />
        </Flex>
      ) : (
        <AppHeaderButton onClick={handleLogIn}>ログイン</AppHeaderButton>
      )}
    </Header>
  );
};
