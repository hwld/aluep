import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { RepositoryFormData, repositoryFormSchema } from "../../share/schema";
import { useGitHubRepoCreate } from "../hooks/useGitHubRepoCreate";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

type Props = {
  defaultValues?: RepositoryFormData;
  themeId: string;
};

export const ThemeJoinCreateRepoForm: React.FC<Props> = ({
  defaultValues = { repoName: "", repoDescription: "" },
  themeId,
}) => {
  //ここのページは使っていないかも

  const {
    control,
    formState: { errors },
  } = useForm<RepositoryFormData>({
    defaultValues,
    resolver: zodResolver(repositoryFormSchema),
  });
  const createRepositoryMutation = useGitHubRepoCreate(themeId);

  const handleCreateRepository = (data: RepositoryFormData) => {
    createRepositoryMutation.mutate(data, {
      onSuccess: (data) => {},
    });
  };

  return (
    <>
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
    </>
  );
};
