import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
import {
  RepositoryFormData,
  repositoryFormSchema,
  ThemeJoinFormData,
} from "../../share/schema";
import { useGitHubRepoCreate } from "../hooks/useGitHubRepoCreate";
import { AppForm } from "./AppForm";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

type Props = {
  defaultValues?: RepositoryFormData;
  isLoading?: boolean;
  themeId: string;
  onSubmit: (data: ThemeJoinFormData) => void;
  onCancel: () => void;
  submitText: string;
  repoFormData?: RepositoryFormData;
};

export const ThemeJoinNewForm: React.FC<Props> = ({
  isLoading,
  themeId,
  onSubmit,
  onCancel,
  submitText,
  repoFormData,
  defaultValues = {
    repoName: repoFormData?.repoName ?? "",
    repoDescription: repoFormData?.repoDescription ?? "",
    comment: repoFormData?.comment ?? "",
  },
}) => {
  const createRepositoryMutation = useGitHubRepoCreate(themeId);

  //開発するボタンを押したときの動作
  const handleCreateRepository = (data: RepositoryFormData) => {
    const comment: string | undefined = data.comment;

    createRepositoryMutation.mutate(data, {
      //リポジトリが作成に成功したら、お題に参加する
      onSuccess: (data) => {
        const join: {
          comment: string | undefined;
          themeId: string;
          githubUrl: string;
        } = {
          comment: comment,
          themeId: themeId,
          githubUrl: data.repoUrl,
        };
        onSubmit(join);
      },
    });
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RepositoryFormData>({
    defaultValues: { ...defaultValues },
    resolver: zodResolver(repositoryFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(handleCreateRepository)}
      onCancel={onCancel}
      submitIcon={MdComputer}
      submitText={submitText}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="repoName"
        render={({ field }) => {
          return (
            <AppTextInput
              withAsterisk
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
              label="リポジトリの説明"
              minRows={3}
              error={errors.repoDescription?.message}
              {...field}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <AppTextarea
              label="コメント"
              minRows={5}
              error={errors.comment?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
function onSetRepositoryUrl(repoUrl: string) {
  throw new Error("Function not implemented.");
}
