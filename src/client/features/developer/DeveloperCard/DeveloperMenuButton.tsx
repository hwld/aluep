import { ActionIcon, Divider, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { RouterInputs } from "../../../../server/lib/trpc";
import { Theme } from "../../../../server/models/theme";
import { ThemeDeveloper } from "../../../../server/models/themeDeveloper";
import { Routes } from "../../../../share/routes";
import { ReportBaseForm } from "../../../../share/schema";
import { trpc } from "../../../lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "../../../lib/utils";
import { AppConfirmModal } from "../../../ui/AppConfirmModal";
import { AppMenu } from "../../../ui/AppMenu/AppMenu";
import { MenuDropdown } from "../../../ui/AppMenu/MenuDropdown";
import { MenuItem } from "../../../ui/AppMenu/MenuItem";
import { MenuLinkItem } from "../../../ui/AppMenu/MenuLinkItem";
import { AppModal } from "../../../ui/AppModal";
import { ReportForm } from "../../report/ReportForm";
import { useThemeJoin } from "../../theme/useThemeJoin";

type Props = { developer: ThemeDeveloper; theme: Theme; isOwner: boolean };
export const DeveloperMenuButton: React.FC<Props> = ({
  developer,
  theme,
  isOwner,
}) => {
  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const {
    mutations: { cancelJoinMutation },
  } = useThemeJoin(developer.themeId);

  const handleDeleteDeveloper = () => {
    cancelJoinMutation.mutate(
      { developerId: developer.id },
      {
        onSuccess: () => {
          showSuccessNotification({
            title: "開発情報の削除",
            message: "開発情報を削除しました。",
          });
          closeDeleteModal();
          router.push(Routes.theme(theme.id));
        },
        onError: () => {
          showErrorNotification({
            title: "開発情報の削除",
            message: "開発情報を削除できませんでした。",
          });
        },
      }
    );
  };

  const reportDeveloperMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["developer"]) => {
      return trpc.report.developer.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "開発情報の通報",
        message: "開発情報を通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "開発情報の通報",
        message: "開発情報を通報できませんでした。",
      });
    },
  });

  const handleSubmitReportDeveloper = (data: ReportBaseForm) => {
    reportDeveloperMutation.mutate({
      reportDetail: data.reportDetail,
      targetDeveloepr: {
        url: `${window.location.origin}${Routes.developer(
          theme.id,
          developer.id
        )}`,
        name: developer.name,
      },
    });
  };

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
          {isOwner && (
            <>
              <MenuLinkItem
                icon={<RiEdit2Fill size={20} />}
                href={Routes.developerUpdate(developer.themeId, developer.id)}
              >
                開発情報を更新する
              </MenuLinkItem>
              <MenuItem
                icon={<FaTrash size={18} />}
                onClick={openDeleteModal}
                red
              >
                開発情報を削除する
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
        title="開発情報の削除"
        message={
          <>
            開発情報を削除してもよろしいですか？
            <br />
            開発情報を削除すると、もらった「いいね」の情報が完全に削除されます。
          </>
        }
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteDeveloper}
        isConfirming={cancelJoinMutation.isLoading}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="開発情報の通報"
      >
        <ReportForm
          submitText="開発情報を通報する"
          onSubmit={handleSubmitReportDeveloper}
          onCancel={closeReportModal}
          isLoading={reportDeveloperMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
