import { Box, Flex, Header, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import { MdLogin, MdPostAdd } from "react-icons/md";
import { AppHeaderButton } from "./AppHeaderButton";
import { AppHeaderLinkButton } from "./AppHeaderLinkButton";
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
        borderBottom: "none",
        position: "sticky",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.red[7],
        boxShadow: `0px 1px 6px ${theme.fn.rgba(theme.colors.red[7], 0.5)}`,
      })}
    >
      <Flex align="center" gap={5}>
        <Box sx={{ alignSelf: "flex-end" }}>
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
        </Box>
        <Text fw={700} color="gray.1" size={22} component={Link} href="/">
          AppThemePost
        </Text>
      </Flex>
      <Flex gap={10}>
        <AppHeaderLinkButton
          leftIcon={<FaSearch size={18} />}
          href="/themes/search"
        >
          お題を検索する
        </AppHeaderLinkButton>
        {user ? (
          <Flex gap={10} align="center">
            <AppHeaderButton
              leftIcon={<MdPostAdd size={25} />}
              onClick={handleCreateTheme}
            >
              お題を投稿する
            </AppHeaderButton>
            <UserMenuButton user={user} />
          </Flex>
        ) : (
          <AppHeaderButton
            leftIcon={<MdLogin size={25} />}
            onClick={handleLogIn}
          >
            ログイン
          </AppHeaderButton>
        )}
      </Flex>
    </Header>
  );
};
