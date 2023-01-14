import { Box, Flex, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import { IoMdLogIn } from "react-icons/io";
import {
  MdHome,
  MdOutlinePersonSearch,
  MdPostAdd,
  MdSearch,
} from "react-icons/md";
import { useRequireLoginModal } from "../../contexts/RequireLoginModalProvider";
import { UserMenuButton } from "../AppHeader/UserMenuButton";
import { SideMenuAppTitle } from "./SideMenuAppTitle";
import { SideMenuItem } from "./SideMenuItem";
import { SideMenuToggle } from "./SideMenuToggle";

type Props = { user?: Session["user"] };

const barMinWidth = 70;
const barPadding = 12;
const iconWidth = barMinWidth - barPadding * 2;

export const AppSideMenu: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [isOpen, { toggle }] = useDisclosure(false);
  const { openLoginModal } = useRequireLoginModal();

  const handleClickCreateTheme = (e: SyntheticEvent) => {
    if (!user) {
      e.preventDefault();
      openLoginModal("/themes/create");
      return;
    }
  };

  const handleLogin = () => {
    signIn("github");
  };

  return (
    <Box h="100vh" p="md" sx={{ position: "sticky", top: 0, zIndex: 1 }}>
      <Box
        w={isOpen ? 300 : barMinWidth}
        h="100%"
        bg="red.7"
        p={barPadding}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: theme.radius.lg,
          transition: "all 200ms",
        })}
      >
        <Stack>
          <Flex
            align="center"
            justify="space-between"
            sx={{ overflow: "hidden", gap: isOpen ? "5px" : "0px" }}
          >
            <SideMenuAppTitle />
            <SideMenuToggle
              isOpen={isOpen}
              onToggle={toggle}
              width={`${iconWidth}px`}
            />
          </Flex>
          <Stack spacing={10}>
            <SideMenuItem
              icon={MdHome}
              label="ホーム"
              asLink
              href="/"
              active={router.route === "/"}
              tooltip={!isOpen}
            />
            <SideMenuItem
              icon={MdPostAdd}
              label="お題を投稿"
              onClick={handleClickCreateTheme}
              asLink
              href="/themes/create"
              active={router.route === "/themes/create"}
              tooltip={!isOpen}
            />
            <SideMenuItem
              icon={MdSearch}
              label="お題を検索"
              asLink
              href="/themes/search"
              active={router.route === "/themes/search"}
              tooltip={!isOpen}
            />
            <SideMenuItem
              icon={MdOutlinePersonSearch}
              label="ユーザーを検索"
              asLink
              href="/users/search"
              active={router.route === "/users/search"}
              tooltip={!isOpen}
            />
          </Stack>
        </Stack>
        <Flex mb="sm">
          {user ? (
            //TODO: 広げたときにユーザーの情報がある程度表示されるようにする
            <Flex justify="center" sx={{ width: iconWidth }}>
              <UserMenuButton user={user} />
            </Flex>
          ) : (
            <SideMenuItem
              icon={IoMdLogIn}
              label="ログイン"
              onClick={handleLogin}
              tooltip={!isOpen}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
};
