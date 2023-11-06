import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import {
  ReportBaseForm,
  ReportDevMemoInput,
  ReportMeta,
} from "@/models/report";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: ReportMeta<ReportDevMemoInput>;
};

export const ReportDevMemo: React.FC<Props> = ({
  isOpen,
  onClose,
  reportMeta,
}) => {
  const reportDevMemoMutation = useMutationWithNotification(
    trpc.report.devMemo,
    {
      succsesNotification: {
        title: "開発メモの通報",
        message: "開発メモを通報しました。",
      },
      errorNotification: {
        title: "開発メモの通報",
        message: "開発メモを通報できませんでした。",
      },
      onSuccess: () => {
        onClose();
      },
    }
  );

  const handleSubmitReportDevMemo = (data: ReportBaseForm) => {
    reportDevMemoMutation.mutate({
      ...reportMeta,
      reportDetail: data.reportDetail,
    });
  };

  return (
    <AppModal opened={isOpen} onClose={onClose} title="開発メモの通報">
      <ReportForm
        submitText="開発メモを通報する"
        onSubmit={handleSubmitReportDevMemo}
        onCancel={onClose}
        isLoading={reportDevMemoMutation.isLoading}
      />
    </AppModal>
  );
};
