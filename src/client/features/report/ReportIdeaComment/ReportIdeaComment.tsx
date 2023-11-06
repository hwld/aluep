import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import {
  ReportBaseForm,
  ReportIdeaCommentInput,
  ReportMeta,
} from "@/models/report";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: ReportMeta<ReportIdeaCommentInput>;
};

export const ReportIdeaComment: React.FC<Props> = ({
  isOpen,
  onClose,
  reportMeta,
}) => {
  const reportIdeaCommentMutation = useMutationWithNotification(
    trpc.report.ideaComment,
    {
      succsesNotification: {
        title: "コメントの通報",
        message: "コメントを通報しました。",
      },
      errorNotification: {
        title: "コメントの通報",
        message: "コメントを通報できませんでした。",
      },
      onSuccess: () => {
        onClose();
      },
    }
  );

  const handleSubmitReportIdeaComment = (data: ReportBaseForm) => {
    reportIdeaCommentMutation.mutate({
      ...reportMeta,
      reportDetail: data.reportDetail,
    });
  };

  return (
    <AppModal opened={isOpen} onClose={onClose} title="コメントの通報">
      <ReportForm
        submitText="コメントを通報する"
        onSubmit={handleSubmitReportIdeaComment}
        onCancel={onClose}
        isLoading={reportIdeaCommentMutation.isLoading}
      />
    </AppModal>
  );
};
