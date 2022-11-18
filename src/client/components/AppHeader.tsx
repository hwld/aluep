import { Button, Flex, Header, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { MdPostAdd } from "react-icons/md";
import { UserMenuButton } from "./UserMenuButton";

// TODO
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
      <Text fw={700} color="gray.1" size={22} component={Link} href="/">
        AppThemePost
      </Text>
      {user ? (
        <Flex gap={10} align="center">
          <Button
            component={Link}
            href="/themes/create"
            leftIcon={<MdPostAdd size={25} />}
            variant="white"
            sx={{ borderWidth: "2px" }}
          >
            お題を投稿する
          </Button>
          <UserMenuButton user={user} />
        </Flex>
      ) : (
        <Button variant="white" onClick={handleLogIn}>
          ログイン
        </Button>
      )}
    </Header>
  );
};
