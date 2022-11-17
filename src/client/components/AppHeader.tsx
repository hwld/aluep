import { ActionIcon, Avatar, Button, Header, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { UserMenuButton } from "./UserMenuButton";

type Props = { user?: Session["user"] };

export const AppHeader: React.FC<Props> = ({ user }) => {
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
      <Text fw={700} color="gray.1" size={22}>
        AppThemePost
      </Text>
      {user ? (
        <UserMenuButton user={user} />
      ) : (
        <Button variant="white" color="red.7" onClick={handleLogIn}>
          ログイン
        </Button>
      )}
    </Header>
  );
};
