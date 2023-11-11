import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { LoggedInUserCard } from "@/client/ui/AppSidebar/LoggedInUserCard/LoggedInUserCard";
import { User } from "@/models/user";
import { Routes } from "@/share/routes";
import { Menu, UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import {
  IconLogout2,
  IconTrash,
  IconUserCircle,
  IconUserHeart,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import classes from "./LoggedInUserMenuButton.module.css";

type Props = Omit<
  {
    user: User;
    iconWidth: number;
  } & UnstyledButtonProps,
  "children"
>;

export const LoggedInUserMenuButton: React.FC<Props> = ({
  user,
  iconWidth,
  ...props
}) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <AppMenu offset={10} position="right-end">
      <Menu.Target>
        <UnstyledButton {...props} className={classes.button}>
          <LoggedInUserCard iconWidth={iconWidth} user={user} />
        </UnstyledButton>
      </Menu.Target>
      <AppMenuDropdown maw={180} className={classes.dropdown}>
        <AppMenuLinkItem
          leftSection={<IconUserCircle />}
          href={Routes.user(user.id)}
        >
          プロフィール
        </AppMenuLinkItem>
        <AppMenuLinkItem
          leftSection={<IconUserHeart />}
          href={Routes.userFavorites(user.id)}
        >
          お気に入りユーザー
        </AppMenuLinkItem>
        <AppMenuItem leftSection={<IconLogout2 />} onClick={handleLogOut}>
          ログアウト
        </AppMenuItem>
        <AppMenuLinkItem
          leftSection={<IconTrash />}
          href={Routes.userDelete}
          red
        >
          アカウント削除
        </AppMenuLinkItem>
      </AppMenuDropdown>
    </AppMenu>
  );
};
