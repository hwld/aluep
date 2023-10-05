import { useDevelop } from "@/client/features/dev/useDevelop";
import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenu/AppMenuLinkItem/AppMenuLinkItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { Development } from "@/models/development";
import { ReportBaseForm } from "@/models/report";
import { RouterInputs } from "@/server/lib/trpc";
import { Routes } from "@/share/routes";
import { ActionIcon, Divider, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "../../../lib/utils";
import classes from "./DevMenuButton.module.css";

type Props = { development: Development; isOwner: boolean };
export const DevMenuButton: React.FC<Props> = ({ development, isOwner }) => {
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
  } = useDevelop({ ideaId: development.ideaId });

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
            c="gray.7"
            className={classes.icon}
            onClick={stopPropagation}
          >
            <BsThreeDots size="70%" />
          </ActionIcon>
        </Menu.Target>

        <AppMenuDropdown>
          {isOwner && (
            <>
              <AppMenuLinkItem
                leftSection={<RiEdit2Fill size={20} />}
                href={Routes.developmentUpdate(
                  development.ideaId,
                  development.id
                )}
              >
                開発情報を編集する
              </AppMenuLinkItem>
              <AppMenuItem
                red
                leftSection={<FaTrash size={18} />}
                onClick={openDeleteModal}
              >
                開発情報を削除する
              </AppMenuItem>
              <Divider my="5px" />
            </>
          )}
          <AppMenuItem
            leftSection={<MdFlag size={18} />}
            onClick={openReportModal}
          >
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
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
