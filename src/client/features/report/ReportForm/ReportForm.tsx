import { AppForm } from "@/client/ui/AppForm/AppForm";
import { ReportBaseForm, reportBaseFormSchema } from "@/models/report";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@mantine/core";
import { IconFlag } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";

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
    defaultValues: { reportDetail: "" },
    resolver: zodResolver(reportBaseFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitText={submitText}
      submitIcon={IconFlag}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="reportDetail"
        render={({ field }) => {
          return (
            <Textarea
              required
              label="通報の内容"
              styles={{ input: { height: "250px" } }}
              error={errors.reportDetail?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
