import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { Idea } from "@/models/idea";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SvgDots, SvgEdit, SvgFlag, SvgTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import classes from "./IdeaOperationButton.module.css";

type Props = { idea: Idea; isIdeaOwner: boolean };
export const IdeaOperationButton: React.FC<Props> = ({ idea, isIdeaOwner }) => {
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
  const deleteIdeaMutation = trpc.idea.delete.useMutation({
    onSuccess: async () => {
      showSuccessNotification({
        title: "お題の削除",
        message: "お題を削除しました",
      });

      await router.replace(Routes.home);
      closeDeleteModal();
    },
    onError: () => {
      showErrorNotification({
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const handleDeleteIdea = () => {
    deleteIdeaMutation.mutate({ ideaId: idea.id });
  };

  // お題の通報
  const reportIdeaMutation = trpc.report.idea.useMutation({
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

  const handleSubmitReportIdea = (data: ReportBaseForm) => {
    reportIdeaMutation.mutate({
      reportDetail: data.reportDetail,
      targetIdea: {
        url: `${window.location.origin}${Routes.idea(idea.id)}`,
        title: idea.title,
      },
    });
  };

  return (
    <>
      <AppMenu position="bottom-start">
        <Menu.Target>
          <ActionIcon size={35} className={classes.icon}>
            <SvgDots
              width="70%"
              height="70%"
              color="var(--mantine-color-gray-5)"
            />
          </ActionIcon>
        </Menu.Target>
        <AppMenuDropdown>
          {isIdeaOwner && (
            <>
              <AppMenuLinkItem
                leftSection={<SvgEdit />}
                href={Routes.ideaUpdate(idea.id)}
              >
                お題を編集する
              </AppMenuLinkItem>
              <AppMenuItem
                leftSection={<SvgTrash />}
                red
                onClick={openDeleteModal}
              >
                お題を削除する
              </AppMenuItem>

              <AppMenuDivider />
            </>
          )}
          <AppMenuItem leftSection={<SvgFlag />} onClick={openReportModal}>
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>
      <AppConfirmModal
        title="お題の削除"
        message={
          <>
            お題を削除してもよろしいですか？
            <br />
            お題を削除すると、もらった「いいね」、他のユーザーの開発情報が完全に削除されます。
          </>
        }
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteIdea}
        isConfirming={deleteIdeaMutation.isLoading}
        confirmIcon={SvgTrash}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="お題の通報"
      >
        <ReportForm
          submitText="お題を通報する"
          onSubmit={handleSubmitReportIdea}
          onCancel={closeReportModal}
          isLoading={reportIdeaMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
