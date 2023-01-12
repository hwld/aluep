import { Box, Flex, MediaQuery, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SyntheticEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { MdLogin, MdOutlinePersonSearch, MdPostAdd } from "react-icons/md";
import { useRequireLoginModal } from "../../contexts/RequireLoginModalProvider";
import { AppHeaderButton } from "./AppHeaderButton";
import { AppHeaderLinkButton } from "./AppHeaderLinkButton";
import { UserMenuButton } from "./UserMenuButton";

type Props = { user?: Session["user"] };

export const appHeaderHeightPx = 60;

export const AppHeader: React.FC<Props> = ({ user }) => {
  const { openLoginModal } = useRequireLoginModal();

  const handleLogIn = () => {
    signIn("github");
  };

  const handleClickCreateTheme = (e: SyntheticEvent) => {
    if (!user) {
      e.preventDefault();
      openLoginModal("/themes/create");
      return;
    }
  };

  return (
    <Box
      sx={(theme) => ({
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: theme.colors.red[7],
      })}
    >
      <Box
        p="xs"
        px={30}
        sx={(theme) => ({
          height: appHeaderHeightPx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: theme.colors.red[7],
          boxShadow: `0px 1px 6px ${theme.fn.rgba(theme.colors.red[7], 0.5)}`,
        })}
      >
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center" gap={5}>
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                textDecoration: "none",
                gap: "3px",
              }}
            >
              <Image src="/logo.svg" alt="logo" width={40} height={40} />
              {/* 画面幅が小さいときはタイトルは表示しない */}
              {/* TODO: ヘッダーのレイアウトの度に微調整する必要がありそう・・・ */}
              <MediaQuery smallerThan={1000} styles={{ display: "none" }}>
                <Text fw={700} color="gray.1" size={22} mt={2}>
                  AppThemePost
                </Text>
              </MediaQuery>
            </Box>
          </Flex>
          <Flex gap={10} align="center">
            <AppHeaderLinkButton
              icon={<MdOutlinePersonSearch size={18} />}
              href="/users/search"
              text="ユーザーを検索する"
            />
            <AppHeaderLinkButton
              icon={<FaSearch size={18} />}
              href="/themes/search"
              text="お題を検索する"
            />
            <AppHeaderLinkButton
              icon={<MdPostAdd size={25} />}
              href="/themes/create"
              onClick={handleClickCreateTheme}
              text="お題を投稿する"
            />
            {user ? (
              <UserMenuButton user={user} />
            ) : (
              <AppHeaderButton
                leftIcon={<MdLogin size={25} />}
                onClick={handleLogIn}
              >
                ログイン
              </AppHeaderButton>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
