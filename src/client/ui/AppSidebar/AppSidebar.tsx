import { DevInProgresSidebarItem } from "@/client/features/dev/InProgresDevSidebarItem/InProgresDevSidebarItem";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { LoggedInUserCard } from "@/client/ui/LoggedInUserCard/LoggedInUserCard";
import { LoggedInUserMenu } from "@/client/ui/LoggedInUserMenu/LoggedInUserMenu";
import { SidebarAppTitle } from "@/client/ui/SidebarAppTitle/SidebarAppTitle";
import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { SidebarToggle } from "@/client/ui/SidebarToggle/SidebarToggle";
import { Routes } from "@/share/routes";
import { Box, Flex, Stack, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import {
  TbFilePlus,
  TbHome,
  TbInfoCircle,
  TbLogin2,
  TbMail,
  TbSearch,
  TbUserSearch,
} from "react-icons/tb";
import classes from "./AppSidebar.module.css";

type Props = { loggedInUser?: Session["user"] };

const barMinWidth = 70;
const barPadding = 12;
const iconWidth = barMinWidth - barPadding * 2;

export const AppSidebar: React.FC<Props> = ({ loggedInUser }) => {
  const router = useRouter();
  const [isOpen, { toggle }] = useDisclosure(true);
  const { openLoginModal } = useRequireLoginModal();

  const isWideDisplay = useMediaQuery("(min-width: 1200px)", true);
  const isMenuOpen = isWideDisplay && isOpen;

  const handleClickCreateIdea = (e: SyntheticEvent) => {
    if (!loggedInUser) {
      e.preventDefault();
      openLoginModal(Routes.ideaCreate);
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
    <Box h="100dvh" p={3} className={classes.root}>
      <Box
        w={isMenuOpen ? 300 : barMinWidth}
        h="100%"
        bg="red.7"
        p={barPadding}
        className={classes["side-bar"]}
      >
        <Stack>
          <Flex
            align="center"
            justify="space-between"
            gap={isMenuOpen ? "5px" : "0px"}
            className={classes["title-wrapper"]}
          >
            <SidebarAppTitle />

            {isWideDisplay && (
              <SidebarToggle
                isOpen={isOpen}
                onToggle={handleToggle}
                width={`${iconWidth}px`}
              />
            )}
          </Flex>
          <Stack gap={10}>
            <SidebarItem
              icon={TbHome}
              label="ホーム"
              asLink
              href={Routes.home}
              active={router.route === Routes.home}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={TbFilePlus}
              label="お題を投稿"
              onClick={handleClickCreateIdea}
              asLink
              href={Routes.ideaCreate}
              active={router.route === Routes.ideaCreate}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={TbSearch}
              label="お題を検索"
              asLink
              href={Routes.ideaSearch()}
              active={router.route === Routes.ideaSearch()}
              tooltip={!isMenuOpen}
            />
            {loggedInUser && (
              <DevInProgresSidebarItem
                tooltip={!isMenuOpen}
                loggedInUserId={loggedInUser.id}
              />
            )}
            <SidebarItem
              icon={TbUserSearch}
              label="ユーザーを検索"
              asLink
              href={Routes.userSearch}
              active={router.route === Routes.userSearch}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={TbInfoCircle}
              label="Aluepについて"
              asLink
              href={Routes.about}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={TbMail}
              label="お問い合わせ"
              asLink
              href={process.env.NEXT_PUBLIC_CONTACT_URL || Routes.serverError}
              target="_blank"
              tooltip={!isMenuOpen}
            />
          </Stack>
        </Stack>
        {loggedInUser ? (
          <LoggedInUserMenu
            user={loggedInUser}
            trigger={
              <UnstyledButton
                bg="red.8"
                p={`20px ${barPadding}px 20px ${barPadding}px`}
                m={`0 -${barPadding}px -${barPadding}px -${barPadding}px`}
                className={classes["user-menu"]}
              >
                <LoggedInUserCard iconWidth={iconWidth} user={loggedInUser} />
              </UnstyledButton>
            }
          />
        ) : (
          <SidebarItem
            icon={TbLogin2}
            label="ログイン"
            onClick={handleLogin}
            tooltip={!isMenuOpen}
          />
        )}
      </Box>
    </Box>
  );
};
