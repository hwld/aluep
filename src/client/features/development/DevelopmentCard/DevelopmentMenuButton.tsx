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
import { Development } from "../../../../server/models/development";
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
import { useDevelop } from "../useDevelop";

type Props = { development: Development; isOwner: boolean };
export const DevelopmentMenuButton: React.FC<Props> = ({
  development,
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
    mutations: { cancelDevelopMutation },
  } = useDevelop(development.ideaId);

  const handleDeleteDevelopment = () => {
    cancelDevelopMutation.mutate(
      { developmentId: development.id },
      {
        onSuccess: () => {
          showSuccessNotification({
            title: "開発情報の削除",
            message: "開発情報を削除しました。",
          });
          closeDeleteModal();
          router.push(Routes.idea(development.ideaId));
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

  const reportDevelopmentMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["development"]) => {
      return trpc.report.development.mutate(data);
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

  const handleSubmitReportDevelopment = (data: ReportBaseForm) => {
    reportDevelopmentMutation.mutate({
      reportDetail: data.reportDetail,
      targetDeveloepr: {
        url: `${window.location.origin}${Routes.development(
          development.ideaId,
          development.id
        )}`,
        name: development.developerUserName,
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
                href={Routes.developmentUpdate(
                  development.ideaId,
                  development.id
                )}
              >
                開発情報を編集する
              </MenuLinkItem>
              <MenuItem
                red
                icon={<FaTrash size={18} />}
                onClick={openDeleteModal}
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
        onConfirm={handleDeleteDevelopment}
        isConfirming={cancelDevelopMutation.isLoading}
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
          onSubmit={handleSubmitReportDevelopment}
          onCancel={closeReportModal}
          isLoading={reportDevelopmentMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
