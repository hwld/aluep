import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm, ReportMeta, ReportUserInput } from "@/models/report";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: ReportMeta<ReportUserInput>;
};

export const ReportUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reportMeta,
}) => {
  const reportUserMutation = useMutationWithNotification(trpc.report.user, {
    succsesNotification: {
      title: "ユーザーの通報",
      message: "ユーザーを通報しました。",
    },
    errorNotification: {
      title: "ユーザーの通報",
      message: "ユーザーを通報できませんでした。",
    },
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmitReportUser = (data: ReportBaseForm) => {
    reportUserMutation.mutate({
      ...reportMeta,
      reportDetail: data.reportDetail,
    });
  };

  return (
    <AppModal opened={isOpen} onClose={onClose} title="ユーザーの通報">
      <ReportForm
        submitText="ユーザーを通報する"
        onSubmit={handleSubmitReportUser}
        onCancel={onClose}
        isLoading={reportUserMutation.isLoading}
      />
    </AppModal>
  );
};
