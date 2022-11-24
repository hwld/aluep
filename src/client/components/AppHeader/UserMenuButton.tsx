import { Avatar, Divider, Menu, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { AppMenu } from "../AppMenu/AppMenu";
import { MenuDropdown } from "../AppMenu/MenuDropdown";
import { MenuItem } from "../AppMenu/MenuItem";
import { MenuLinkItem } from "../AppMenu/MenuLinkItem";

type Props = { user: Session["user"] };

export const UserMenuButton: React.FC<Props> = ({ user }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <AppMenu>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={user.image} radius="xl" />
        </UnstyledButton>
      </Menu.Target>
      <MenuDropdown>
        <Menu.Label>ユーザー設定</Menu.Label>
        <Divider color="gray.3" />
        <MenuLinkItem icon={<RiEdit2Fill size={20} />} href="/users/profile">
          プロフィール変更
        </MenuLinkItem>
        <MenuItem icon={<MdLogout size={20} />} onClick={handleLogOut}>
          ログアウト
        </MenuItem>
        <MenuLinkItem icon={<FaTrash size={16} />} href="/users/delete" red>
          アカウント削除
        </MenuLinkItem>
      </MenuDropdown>
    </AppMenu>
  );
};