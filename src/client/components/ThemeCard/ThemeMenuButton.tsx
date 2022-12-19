import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Theme } from "../../../server/models/theme";
import { themesQueryKey } from "../../hooks/usePaginatedThemesQuery";
import { useSessionQuery } from "../../hooks/useSessionQuery";
import { trpc } from "../../trpc";
import { stopPropagation } from "../../utils";
import { AppMenu } from "../AppMenu/AppMenu";
import { MenuDropdown } from "../AppMenu/MenuDropdown";
import { MenuItem } from "../AppMenu/MenuItem";
import { MenuLinkItem } from "../AppMenu/MenuLinkItem";
import { ThemeDeleteModal } from "./ThemeDeleteModal";

type Props = { theme: Theme };
export const ThemeMenuButton: React.FC<Props> = ({ theme }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { session } = useSessionQuery();
  const queryClient = useQueryClient();

  // TODO: hookに切り出したい
  const deleteThemeMutation = useMutation({
    mutationFn: () => {
      return trpc.theme.delete.mutate({ themeId: theme.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themesQueryKey);
      showNotification({
        color: "green",
        title: "お題の削除",
        message: "お題を削除しました。",
      });
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  return (
    <>
      <AppMenu>
        <Menu.Target>
          <ActionIcon
            size={30}
            color="gray"
            sx={(theme) => ({
              transition: "all 150ms",
              "&:hover": {
                backgroundColor: theme.fn.rgba(theme.colors.gray[5], 0.1),
              },
            })}
            onClick={stopPropagation}
          >
            <BsThreeDots size="70%" />
          </ActionIcon>
        </Menu.Target>

        <MenuDropdown>
          {session?.user.id === theme.user.id ? (
            <>
              <MenuLinkItem
                icon={<RiEdit2Fill size={20} />}
                href={`/themes/${theme.id}/update`}
              >
                お題を更新する
              </MenuLinkItem>
              <MenuItem icon={<FaTrash size={18} />} onClick={open} red>
                お題を削除する
              </MenuItem>
            </>
          ) : (
            <Menu.Label>選択できる項目がありません。</Menu.Label>
          )}
        </MenuDropdown>
      </AppMenu>
      <ThemeDeleteModal
        opened={opened}
        onClose={close}
        onDeleteTheme={() => {
          deleteThemeMutation.mutate(undefined, { onSuccess: () => close() });
        }}
        deleting={deleteThemeMutation.isLoading}
      />
    </>
  );
};
