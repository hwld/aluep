import { Avatar, Divider, Menu, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

type Props = { user: Session["user"] };

export const UserMenuButton: React.FC<Props> = ({ user }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={user.image} radius="xl" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>ユーザー設定</Menu.Label>
        <Divider color="gray.3" />
        <Menu.Item
          icon={<RiEdit2Fill size={20} />}
          component={Link}
          href="/users/profile"
        >
          プロフィール変更
        </Menu.Item>
        <Menu.Item icon={<MdLogout size={20} />} onClick={handleLogOut}>
          ログアウト
        </Menu.Item>
        <Menu.Item
          icon={<FaTrash size={16} />}
          color="red"
          component={Link}
          href="/users/delete"
        >
          アカウント削除
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
