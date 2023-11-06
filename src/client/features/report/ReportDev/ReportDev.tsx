import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm, ReportDevInput, ReportMeta } from "@/models/report";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: ReportMeta<ReportDevInput>;
};

export const ReportDev: React.FC<Props> = ({ isOpen, onClose, reportMeta }) => {
  const reportDevMutation = useMutationWithNotification(trpc.report.dev, {
    succsesNotification: {
      title: "開発情報の通報",
      message: "開発情報を通報しました。",
    },
    errorNotification: {
      title: "開発情報の通報",
      message: "開発情報を通報できませんでした。",
    },
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmitReportDev = (data: ReportBaseForm) => {
    reportDevMutation.mutate({
      ...reportMeta,
      reportDetail: data.reportDetail,
    });
  };

  return (
    <AppModal opened={isOpen} onClose={onClose} title="開発情報の通報">
      <ReportForm
        submitText="開発情報を通報する"
        onSubmit={handleSubmitReportDev}
        onCancel={onClose}
        isLoading={reportDevMutation.isLoading}
      />
    </AppModal>
  );
};
