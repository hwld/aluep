import { ActionIcon, Menu, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Theme } from "../../server/models/theme";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { AppConfirmModal } from "./AppConfirmModal";
import { AppMenu } from "./AppMenu/AppMenu";
import { MenuDropdown } from "./AppMenu/MenuDropdown";
import { MenuItem } from "./AppMenu/MenuItem";
import { MenuLinkItem } from "./AppMenu/MenuLinkItem";

type Props = { theme: Theme };
export const ThemeOperationButton: React.FC<Props> = ({ theme }) => {
  const mantineTheme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const deleteThemeMutation = useMutation({
    mutationFn: () => {
      return trpc.theme.delete.mutate({ themeId: theme.id });
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "お題の削除",
        message: "お題を削除しました",
      });
      close();
      router.push("/");
    },
    onError: () => {
      showErrorNotification({
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const handleDeleteTheme = () => {
    deleteThemeMutation.mutate();
  };

  return (
    <>
      <AppMenu position="bottom-start">
        <Menu.Target>
          <ActionIcon
            size={35}
            radius="xl"
            sx={(theme) => ({
              boxShadow: theme.shadows.md,
              transition: "all 200ms",
              backgroundColor: theme.colors.gray[1],
              "&:hover": {
                boxShadow: `${theme.shadows.md}, 0 0 0 2px ${theme.colors.red[7]}`,
              },
            })}
          >
            <BsThreeDots size="70%" color={mantineTheme.colors.gray[5]} />
          </ActionIcon>
        </Menu.Target>
        <MenuDropdown>
          <MenuLinkItem
            icon={<RiEdit2Fill size={20} />}
            href={`/themes/${theme.id}/update`}
          >
            お題を更新する
          </MenuLinkItem>
          <MenuItem icon={<FaTrash size={18} />} red onClick={open}>
            お題を削除する
          </MenuItem>
        </MenuDropdown>
      </AppMenu>
      <AppConfirmModal
        title="お題の削除"
        message={
          <>
            お題を削除してもよろしいですか？
            <br />
            お題を削除すると、もらった「いいね」、開発者の情報が完全に削除されます。
          </>
        }
        opened={opened}
        onClose={close}
        onConfirm={handleDeleteTheme}
        isConfirming={deleteThemeMutation.isLoading}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
    </>
  );
};
