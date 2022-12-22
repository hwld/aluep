import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { RepositoryFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { isTRPCClientError } from "../utils";
import { AppModal } from "./AppModal";
import { RepositoryForm } from "./RepositoryForm";

type Props = {
  themeId: string;
  onSetRepositoryUrl: (url: string) => void;
  width?: number;
};
export const RepoCreateModalButton: React.FC<Props> = ({
  onSetRepositoryUrl,
  width,
  themeId,
}) => {
  const [opened, setOpened] = useState(false);

  const createRepositoryMutation = useMutation({
    mutationFn: (data: RepositoryFormData) => {
      return trpc.github.createRepo.mutate(data);
    },
    onSuccess: (data) => {
      showNotification({
        color: "green",
        title: "リポジトリ作成",
        message: "リポジトリを作成しました。",
      });
      onSetRepositoryUrl(data.repoUrl);
      setOpened(false);
    },
    onError: (error, fieldValues) => {
      // 認証エラーで失敗した場合、ログインさせた後にリポジトリ作成ページに飛ばす
      if (isTRPCClientError(error) && error.data?.code === "UNAUTHORIZED") {
        showNotification({
          color: "red",
          title: "リポジトリ作成",
          message: "リポジトリの作成に失敗したため、再ログインを行います。",
        });

        const url = new URL(
          `${window.location.origin}/themes/${themeId}/create-repository`
        );
        url.searchParams.set("repoName", fieldValues.repoName);
        url.searchParams.set("repoDescription", fieldValues.repoDescription);

        signIn("github", { callbackUrl: url.toString() });
        return;
      }
      showNotification({
        color: "red",
        title: "リポジトリ作成",
        message:
          "リポジトリを作成できませんでした。\n再度時間をおいて実行してみてください。",
      });
    },
  });

  const handleCreateRepository = (data: RepositoryFormData) => {
    createRepositoryMutation.mutate(data);
  };

  return (
    <>
      <Button
        w={width}
        onClick={() => {
          setOpened(true);
        }}
      >
        作成
      </Button>
      <AppModal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title="GitHubリポジトリの作成"
      >
        <RepositoryForm
          onSubmit={handleCreateRepository}
          onCancel={() => setOpened(false)}
          isSubmitting={createRepositoryMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
