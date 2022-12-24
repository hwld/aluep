import { Button } from "@mantine/core";
import { useState } from "react";
import { RepositoryFormData } from "../../share/schema";
import { useGitHubRepoCreate } from "../hooks/useGitHubRepoCreate";
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
  const createRepositoryMutation = useGitHubRepoCreate(themeId);

  const handleCreateRepository = (data: RepositoryFormData) => {
    createRepositoryMutation.mutate(data, {
      onSuccess: (data) => {
        onSetRepositoryUrl(data.repoUrl);
        setOpened(false);
      },
    });
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
