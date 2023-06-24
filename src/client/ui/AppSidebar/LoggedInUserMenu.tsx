import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { MenuDropdown } from "@/client/ui/AppMenu/MenuDropdown";
import { MenuItem } from "@/client/ui/AppMenu/MenuItem";
import { MenuLinkItem } from "@/client/ui/AppMenu/MenuLinkItem";
import { Routes } from "@/share/routes";
import { OmitStrict } from "@/types/OmitStrict";
import { BadgeProps, Menu } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { BiBookmarkHeart } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";

type Props = Omit<
  { user: Session["user"]; trigger: ReactNode } & OmitStrict<BadgeProps, "sx">,
  "children"
>;

export const LoggedInUserMenu: React.FC<Props> = ({ user, trigger }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <AppMenu offset={10} position="right-end">
      <Menu.Target>{trigger}</Menu.Target>
      <MenuDropdown maw={180} sx={{ zIndex: 1000 }}>
        <MenuLinkItem
          icon={<RiAccountCircleLine size={20} />}
          href={Routes.user(user.id)}
        >
          プロフィール
        </MenuLinkItem>
        <MenuLinkItem
          icon={<BiBookmarkHeart size={20} />}
          href={Routes.userFavorites(user.id)}
        >
          お気に入り
        </MenuLinkItem>
        <MenuItem icon={<MdLogout size={20} />} onClick={handleLogOut}>
          ログアウト
        </MenuItem>
        <MenuLinkItem icon={<FaTrash size={16} />} href={Routes.userDelete} red>
          アカウント削除
        </MenuLinkItem>
      </MenuDropdown>
    </AppMenu>
  );
};
