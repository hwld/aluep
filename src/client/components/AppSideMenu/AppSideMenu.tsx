import { Box, Flex, Stack, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import { IoMdLogIn } from "react-icons/io";
import {
  MdMailOutline,
  MdOutlineHome,
  MdOutlinePersonSearch,
  MdPostAdd,
  MdSearch,
} from "react-icons/md";
import { Routes } from "../../../share/routes";
import { useRequireLoginModal } from "../../contexts/RequireLoginModalProvider";
import { UserMenuButton } from "../UserMenuButton";
import { AppLoginedSideMenu } from "./AppLoginedSideMenu";
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

  const isWideDisplay = useMediaQuery("(min-width: 1200px)", true);
  const isMenuOpen = isWideDisplay && isOpen;

  const handleClickCreateTheme = (e: SyntheticEvent) => {
    if (!user) {
      e.preventDefault();
      openLoginModal(Routes.themeCreate);
      return;
    }
  };

  const handleToggle = () => {
    toggle();
  };

  const handleLogin = () => {
    signIn("github");
  };

  return (
    <Box
      h="100dvh"
      p="md"
      sx={() => ({
        position: "sticky",
        top: 0,
        zIndex: 2,
      })}
    >
      <Box
        w={isMenuOpen ? 300 : barMinWidth}
        h="100%"
        bg="red.7"
        p={barPadding}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: theme.radius.lg,
          transition: "all 200ms",
          overflow: "auto",
        })}
      >
        <Stack>
          <Flex
            align="center"
            justify="space-between"
            sx={{ overflow: "hidden", gap: isMenuOpen ? "5px" : "0px" }}
          >
            <SideMenuAppTitle />

            {isWideDisplay && (
              <SideMenuToggle
                isOpen={isOpen}
                onToggle={handleToggle}
                width={`${iconWidth}px`}
              />
            )}
          </Flex>
          <Stack spacing={10}>
            <SideMenuItem
              icon={MdOutlineHome}
              label="ホーム"
              asLink
              href={Routes.home}
              active={router.route === Routes.home}
              tooltip={!isMenuOpen}
            />
            <SideMenuItem
              icon={MdPostAdd}
              label="お題を投稿"
              onClick={handleClickCreateTheme}
              asLink
              href={Routes.themeCreate}
              active={router.route === Routes.themeCreate}
              tooltip={!isMenuOpen}
            />
            <SideMenuItem
              icon={MdSearch}
              label="お題を検索"
              asLink
              href={Routes.themeSearch()}
              active={router.route === Routes.themeSearch()}
              tooltip={!isMenuOpen}
            />
            <SideMenuItem
              icon={MdOutlinePersonSearch}
              label="ユーザーを検索"
              asLink
              href={Routes.userSearch}
              active={router.route === Routes.userSearch}
              tooltip={!isMenuOpen}
            />
            <SideMenuItem
              icon={MdMailOutline}
              label="お問い合わせ"
              asLink
              href={process.env.NEXT_PUBLIC_CONTACT_URL || Routes.serverError}
              blank={true}
              tooltip={!isMenuOpen}
            />
          </Stack>
        </Stack>
        {user ? (
          <UserMenuButton user={user}>
            <UnstyledButton
              bg="red.8"
              p={`20px ${barPadding}px 20px ${barPadding}px`}
              m={`0 -${barPadding}px -${barPadding}px -${barPadding}px`}
              sx={(theme) => ({
                display: "flex",
                borderBottomLeftRadius: theme.radius.lg,
                borderBottomRightRadius: theme.radius.lg,
              })}
            >
              <AppLoginedSideMenu iconWidth={iconWidth} user={user} />
            </UnstyledButton>
          </UserMenuButton>
        ) : (
          <SideMenuItem
            icon={IoMdLogIn}
            label="ログイン"
            onClick={handleLogin}
            tooltip={!isMenuOpen}
          />
        )}
      </Box>
    </Box>
  );
};
