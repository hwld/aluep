import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm, ReportIdeaInput, ReportMeta } from "@/models/report";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: ReportMeta<ReportIdeaInput>;
};

export const ReportIdeaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reportMeta,
}) => {
  // お題の通報
  const reportIdeaMutation = useMutationWithNotification(trpc.report.idea, {
    succsesNotification: {
      title: "お題の通報",
      message: "お題を通報しました。",
    },
    errorNotification: {
      title: "お題の通報",
      message: "お題を通報できませんでした。",
    },
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmitReportIdea = (data: ReportBaseForm) => {
    reportIdeaMutation.mutate({
      ...reportMeta,
      reportDetail: data.reportDetail,
    });
  };

  return (
    <AppModal opened={isOpen} onClose={onClose} title="お題の通報">
      <ReportForm
        submitText="お題を通報する"
        onSubmit={handleSubmitReportIdea}
        onCancel={onClose}
        isLoading={reportIdeaMutation.isLoading}
      />
    </AppModal>
  );
};
