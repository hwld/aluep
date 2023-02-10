import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { MdFlag } from "react-icons/md";
import { ReportBaseForm, reportBaseFormSchema } from "../../share/schema";
import { AppForm } from "./AppForm";
import { AppTextarea } from "./AppTextarea";

type Props = {
  submitText: string;
  onSubmit: (formData: ReportBaseForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export const ReportForm: React.FC<Props> = ({
  submitText,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportBaseForm>({
    resolver: zodResolver(reportBaseFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitText={submitText}
      submitIcon={MdFlag}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="reportDetail"
        render={({ field }) => {
          return (
            <AppTextarea
              required
              label="通報の内容"
              minRows={10}
              error={errors.reportDetail?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
