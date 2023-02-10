import { ActionIcon, Divider, Menu, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { Theme } from "../../server/models/theme";
import { RouterInputs } from "../../server/trpc";
import { Routes } from "../../share/routes";
import { ReportBaseForm } from "../../share/schema";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { AppConfirmModal } from "./AppConfirmModal";
import { AppMenu } from "./AppMenu/AppMenu";
import { MenuDropdown } from "./AppMenu/MenuDropdown";
import { MenuItem } from "./AppMenu/MenuItem";
import { MenuLinkItem } from "./AppMenu/MenuLinkItem";
import { AppModal } from "./AppModal";
import { ReportForm } from "./ReportForm";

type Props = { theme: Theme; isThemeOwner: boolean };
export const ThemeOperationButton: React.FC<Props> = ({
  theme,
  isThemeOwner,
}) => {
  const mantineTheme = useMantineTheme();
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    isReportModalOpen,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);
  const router = useRouter();

  // お題の削除
  const deleteThemeMutation = useMutation({
    mutationFn: () => {
      return trpc.theme.delete.mutate({ themeId: theme.id });
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "お題の削除",
        message: "お題を削除しました",
      });
      closeDeleteModal();
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

  // お題の通報
  const reportThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["theme"]) => {
      return trpc.report.theme.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "お題の通報",
        message: "お題を通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "お題の通報",
        message: "お題を通報できませんでした。",
      });
    },
  });

  const handleSubmitReportTheme = (data: ReportBaseForm) => {
    reportThemeMutation.mutate({
      reportDetail: data.reportDetail,
      targetTheme: {
        url: `${window.location.origin}/${Routes.theme(theme.id)}`,
        title: theme.title,
      },
    });
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
          {isThemeOwner && (
            <>
              <MenuLinkItem
                icon={<RiEdit2Fill size={20} />}
                href={`/themes/${theme.id}/update`}
              >
                お題を更新する
              </MenuLinkItem>
              <MenuItem
                icon={<FaTrash size={18} />}
                red
                onClick={openDeleteModal}
              >
                お題を削除する
              </MenuItem>

              <Divider my="5px" />
            </>
          )}
          <MenuItem icon={<MdFlag size={18} />} onClick={openReportModal}>
            通報する
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
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTheme}
        isConfirming={deleteThemeMutation.isLoading}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="お題の通報"
      >
        <ReportForm
          submitText="お題を通報する"
          onSubmit={handleSubmitReportTheme}
          onCancel={closeReportModal}
          isLoading={reportThemeMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
