import { ActionIcon, Menu } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SyntheticEvent } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Theme } from "../../../server/models/theme";
import { RouterInputs } from "../../../server/trpc";
import { useSessionQuery } from "../../hooks/useSessionQuery";
import { themesQueryKey } from "../../hooks/useThemesQuery";
import { trpc } from "../../trpc";
import { AppMenu } from "../AppMenu/AppMenu";
import { MenuDropdown } from "../AppMenu/MenuDropdown";
import { MenuItem } from "../AppMenu/MenuItem";
import { MenuLinkItem } from "../AppMenu/MenuLinkItem";

type Props = { theme: Theme };
export const ThemeMenuButton: React.FC<Props> = ({ theme }) => {
  const { session } = useSessionQuery();

  const queryClient = useQueryClient();

  const deleteThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["delete"]) => {
      return trpc.theme.delete.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themesQueryKey);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleDeleteTheme = (e: SyntheticEvent) => {
    e.stopPropagation();
    deleteThemeMutation.mutate({ themeId: theme.id });
  };

  return (
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
        {session?.user.id === theme?.user.id ? (
          <>
            <MenuLinkItem
              icon={<RiEdit2Fill size={20} />}
              href={`/themes/${theme.id}/update`}
            >
              お題を更新する
            </MenuLinkItem>
            <MenuItem
              icon={<FaTrash size={18} />}
              onClick={handleDeleteTheme}
              red
            >
              お題を削除する
            </MenuItem>
          </>
        ) : (
          <Menu.Label>選択できる項目がありません。</Menu.Label>
        )}
      </MenuDropdown>
    </AppMenu>
  );
};
