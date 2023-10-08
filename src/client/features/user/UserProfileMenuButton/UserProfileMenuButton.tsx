import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenu/AppMenuLinkItem/AppMenuLinkItem";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "next-auth";
import { MdFlag } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";

type Props = {
  user: User;
  /** ログインしているユーザーのプロフィールかどうか */
  isOwner: boolean;
};
export const UserProfileMenuButton: React.FC<Props> = ({ user, isOwner }) => {
  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const reportUserMutation = trpc.report.user.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "ユーザーの通報",
        message: "ユーザーを通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "ユーザーの通報",
        message: "ユーザーを通報できませんでした。",
      });
    },
  });

  const handleSubmitReportUser = (data: ReportBaseForm) => {
    reportUserMutation.mutate({
      reportDetail: data.reportDetail,
      targetUser: {
        url: `${window.location.origin}${Routes.user(user.id)}`,
        name: user.name,
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
                leftSection={<RiEdit2Line size={18} />}
                href={Routes.userUpdate}
              >
                プロフィールを編集する
              </AppMenuLinkItem>
              <Divider my={5} />
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
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="ユーザーの通報"
      >
        <ReportForm
          submitText="ユーザーを通報する"
          onSubmit={handleSubmitReportUser}
          onCancel={closeReportModal}
          isLoading={reportUserMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
