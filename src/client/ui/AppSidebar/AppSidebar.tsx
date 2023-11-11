import { InProgresDevSidebarItem } from "@/client/features/dev/InProgresDevSidebarItem/InProgresDevSidebarItem";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { LoggedInUserMenuButton } from "@/client/ui/AppSidebar/LoggedInUserMenuButton/LoggedInUserMenuButton";
import { LoginButton } from "@/client/ui/AppSidebar/LoginButton/LoginButton";
import { AppSkeleton } from "@/client/ui/AppSkeleton/AppSkeleton";
import { AppTooltip } from "@/client/ui/AppTooltip";
import { SidebarAppTitle } from "@/client/ui/SidebarAppTitle/SidebarAppTitle";
import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { SidebarToggle } from "@/client/ui/SidebarToggle/SidebarToggle";
import { setAppConfigCookie } from "@/share/cookie";
import { Routes } from "@/share/routes";
import { Box, Divider, Flex, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconFilePlus,
  IconHome,
  IconInfoCircle,
  IconMail,
  IconSearch,
  IconUserSearch,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import classes from "./AppSidebar.module.css";

type Props = { isOpen?: boolean | undefined };

const barMinWidth = 70;
const barPadding = 12;
const iconWidth = barMinWidth - barPadding * 2;

export const AppSidebar: React.FC<Props> = ({ isOpen = false }) => {
  const { session, isInitialLoading: sessionLoading } = useSessionQuery();
  const loggedInUser = session?.user;
  const router = useRouter();
  const [_isOpen, { toggle }] = useDisclosure(isOpen);
  const { openLoginModal } = useRequireLoginModal();

  const isWideDisplay = useMediaQuery("(min-width: 1200px)", true);
  const isMenuOpen = isWideDisplay && _isOpen;

  const handleClickCreateIdea = (e: SyntheticEvent) => {
    if (!loggedInUser) {
      e.preventDefault();
      openLoginModal(Routes.ideaCreate);
      return;
    }
  };

  const handleToggle = () => {
    toggle();
    setAppConfigCookie({ isSideBarOpen: !_isOpen });
  };

  return (
    <Box h="100dvh" px={5} py="sm" className={classes.root}>
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
                isOpen={_isOpen}
                onToggle={handleToggle}
                width={`${iconWidth}px`}
              />
            )}
          </Flex>
          <Stack gap={10}>
            <SidebarItem
              icon={IconHome}
              label="ホーム"
              asLink
              href={Routes.home}
              active={router.route === Routes.home}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={IconFilePlus}
              label="お題を投稿"
              onClick={handleClickCreateIdea}
              asLink
              href={Routes.ideaCreate}
              active={router.route === Routes.ideaCreate}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={IconSearch}
              label="お題を検索"
              asLink
              href={Routes.ideaSearch()}
              active={router.route === Routes.ideaSearch()}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={IconUserSearch}
              label="ユーザーを検索"
              asLink
              href={Routes.userSearch}
              active={router.route === Routes.userSearch}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={IconInfoCircle}
              label="Aluepについて"
              asLink
              href={Routes.about}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={IconMail}
              label="お問い合わせ"
              asLink
              href={Routes.contact()}
              target="_blank"
              tooltip={!isMenuOpen}
            />
          </Stack>
        </Stack>
        <Stack mt="md">
          {loggedInUser && (
            <>
              <Divider style={{ borderColor: "var(--mantine-color-red-4)" }} />
              <InProgresDevSidebarItem
                tooltip={!isMenuOpen}
                loggedInUserId={loggedInUser.id}
              />
            </>
          )}
          <Flex
            bg="red.8"
            h="90px"
            m={`0 -${barPadding}px -${barPadding}px -${barPadding}px`}
            align="center"
            className={classes["user-section"]}
          >
            {sessionLoading ? (
              <AppSkeleton
                style={{
                  ["--base-color"]: "var(--mantine-color-red-8)",
                  ["--line-color"]: "#c32323",
                  borderRadius: "0",
                }}
                w="100%"
                h="100%"
              />
            ) : loggedInUser ? (
              <LoggedInUserMenuButton
                user={loggedInUser}
                iconWidth={iconWidth}
                h="100%"
                w="100%"
                px={`${barPadding}px`}
              />
            ) : (
              <AppTooltip label="ログイン" position="right" hidden={isMenuOpen}>
                <LoginButton
                  h="100%"
                  w="100%"
                  pr={`${barPadding}px`}
                  pl={`${barPadding - 2}px`}
                />
              </AppTooltip>
            )}
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};
