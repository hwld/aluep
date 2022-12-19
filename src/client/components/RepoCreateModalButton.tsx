import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { RepositoryFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { AppModal } from "./AppModal";
import { RepositoryForm } from "./RepositoryForm";

type Props = {
  onSetRepositoryUrl: (url: string) => void;
  width?: number;
};
export const RepoCreateModalButton: React.FC<Props> = ({
  onSetRepositoryUrl,
  width,
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
    onError: () => {
      showNotification({
        color: "red",
        title: "リポジトリ作成",
        message:
          "リポジトリを作成できませんでした。\n再ログインしてもう一度試してください。",
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
