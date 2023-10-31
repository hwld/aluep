import { useDevMutations } from "@/client/features/dev/useDevMutations";
import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { Dev } from "@/models/dev";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconFlag, IconTrash } from "@tabler/icons-react";
import router from "next/router";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../lib/utils";

type Props = { dev: Dev; isOwner: boolean };
export const DevMenuButton: React.FC<Props> = ({ dev, isOwner }) => {
  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const { deleteDevMutation } = useDevMutations();

  const handleDeleteDev = async () => {
    deleteDevMutation.mutate(
      { devId: dev.id },
      {
        onSuccess: async () => {
          showSuccessNotification({
            title: "開発情報の削除",
            message: "開発情報を削除しました。",
          });

          if (dev?.idea) {
            await router.replace(Routes.idea(dev.idea.id));
          } else {
            await router.replace(Routes.user(dev.developer.id));
          }

          closeDeleteModal();
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

  const reportDevMutation = trpc.report.dev.useMutation({
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

  const handleSubmitReportDev = (data: ReportBaseForm) => {
    reportDevMutation.mutate({
      reportDetail: data.reportDetail,
      targetDeveloepr: {
        url: `${window.location.origin}${Routes.dev(dev.id)}`,
        name: dev.developer.name,
      },
    });
  };

  return (
    <>
      <AppMenu>
        <AppMenuButton />

        <AppMenuDropdown>
          {isOwner && (
            <>
              <AppMenuLinkItem
                leftSection={<IconEdit />}
                href={Routes.devUpdate(dev.id)}
              >
                開発情報を編集する
              </AppMenuLinkItem>
              <AppMenuItem
                red
                leftSection={<IconTrash />}
                onClick={openDeleteModal}
              >
                開発情報を削除する
              </AppMenuItem>
              <AppMenuDivider />
            </>
          )}
          <AppMenuItem leftSection={<IconFlag />} onClick={openReportModal}>
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
        onConfirm={handleDeleteDev}
        isConfirming={deleteDevMutation.isLoading}
        confirmIcon={IconTrash}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="開発情報の通報"
      >
        <ReportForm
          submitText="開発情報を通報する"
          onSubmit={handleSubmitReportDev}
          onCancel={closeReportModal}
          isLoading={reportDevMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
