import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { BsGithub } from "react-icons/bs";
import {
  RepositoryFormData,
  repositoryFormSchema,
} from "../../../share/schema";
import { AppForm } from "../../ui/AppForm";
import { AppTextarea } from "../../ui/AppTextarea";
import { AppTextInput } from "../../ui/AppTextInput";

type Props = {
  onSubmit: (data: RepositoryFormData) => void;
  onCancel: () => void;
  defaultValues?: RepositoryFormData;
  isLoading?: boolean;
};
export const RepositoryForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  defaultValues = { repoName: "", repoDescription: "" },
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RepositoryFormData>({
    defaultValues,
    resolver: zodResolver(repositoryFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitText="リポジトリを作成する"
      submitIcon={BsGithub}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="repoName"
        render={({ field }) => {
          return (
            <AppTextInput
              label="リポジトリ名"
              error={errors.repoName?.message}
              {...field}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="repoDescription"
        render={({ field }) => {
          return (
            <AppTextarea
              label="説明"
              minRows={3}
              error={errors.repoDescription?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
