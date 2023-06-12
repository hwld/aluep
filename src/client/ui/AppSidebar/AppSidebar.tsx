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
import { useRequireLoginModal } from "../../features/session/RequireLoginModalProvider";
import { LoggedInUserCard } from "./LoggedInUserCard";
import { LoggedInUserMenu } from "./LoggedInUserMenu";
import { SidebarAppTitle } from "./SidebarAppTitle";
import { SidebarItem } from "./SidebarItem";
import { SidebarToggle } from "./SidebarToggle";

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
          borderRadius: theme.radius.xl,
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
            <SidebarAppTitle />

            {isWideDisplay && (
              <SidebarToggle
                isOpen={isOpen}
                onToggle={handleToggle}
                width={`${iconWidth}px`}
              />
            )}
          </Flex>
          <Stack spacing={10}>
            <SidebarItem
              icon={MdOutlineHome}
              label="ホーム"
              asLink
              href={Routes.home}
              active={router.route === Routes.home}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={MdPostAdd}
              label="お題を投稿"
              onClick={handleClickCreateIdea}
              asLink
              href={Routes.ideaCreate}
              active={router.route === Routes.ideaCreate}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={MdSearch}
              label="お題を検索"
              asLink
              href={Routes.ideaSearch()}
              active={router.route === Routes.ideaSearch()}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={MdOutlinePersonSearch}
              label="ユーザーを検索"
              asLink
              href={Routes.userSearch}
              active={router.route === Routes.userSearch}
              tooltip={!isMenuOpen}
            />
            <SidebarItem
              icon={MdMailOutline}
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
                sx={(theme) => ({
                  display: "flex",
                  borderBottomLeftRadius: theme.radius.lg,
                  borderBottomRightRadius: theme.radius.lg,
                })}
              >
                <LoggedInUserCard iconWidth={iconWidth} user={loggedInUser} />
              </UnstyledButton>
            }
          />
        ) : (
          <SidebarItem
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
