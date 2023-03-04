import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
import {
  RepositoryFormData,
  repositoryFormSchema,
  ThemeJoinFormData,
} from "../../../share/schema";
import { AppForm } from "../../ui/AppForm";
import { useGitHubRepoCreate } from "../github/useGitHubRepoCreate";

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
      // ここのisLoadingは、お題への参加・開発情報の更新完了を待機するもので、
      // それとは別にgithubリポジトリの作成を待機する必要がある。
      isSubmitting={
        isLoading ||
        createRepositoryMutation.isLoading ||
        createRepositoryMutation.isSuccess
      }
    >
      <Controller
        control={control}
        name="repoName"
        render={({ field }) => {
          return (
            <TextInput
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
            <Textarea
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
            <Textarea
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
