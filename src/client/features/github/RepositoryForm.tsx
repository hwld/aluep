import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { BsGithub } from "react-icons/bs";
import {
  RepositoryFormData,
  repositoryFormSchema,
} from "../../../share/schema";
import { AppForm } from "../../ui/AppForm";

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
            <TextInput
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
            <Textarea
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
