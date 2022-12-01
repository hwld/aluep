import { Button, Flex, Modal, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

type Props = {
  onSetRepositoryUrl: (value: string) => void;
  width?: number;
};
export const RepoCreateModalButton: React.FC<Props> = ({
  onSetRepositoryUrl,
  width,
}) => {
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [opened, setOpened] = useState(false);

  const createRepoMutation = useMutation({
    mutationFn: (data: RouterInputs["github"]["createRepo"]) => {
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
        message: "リポジトリを作成できませんでした。",
      });
    },
  });

  const handleClickCreateRepo = () => {
    createRepoMutation.mutate({ repoName, repoDescription });
  };

  return (
    <>
      <Button
        w={width}
        onClick={() => {
          setRepoName("");
          setRepoDescription("");
          setOpened(true);
        }}
      >
        作成
      </Button>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title="GitHubリポジトリの作成"
        styles={(theme) => ({
          modal: { backgroundColor: theme.colors.gray[1] },
          body: { backgroundColor: theme.colors.gray[1] },
        })}
      >
        <Stack spacing="md">
          <AppTextInput
            label="リポジトリ名"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
          <AppTextarea
            label="説明"
            value={repoDescription}
            onChange={(e) => setRepoDescription(e.target.value)}
            minRows={3}
          />
        </Stack>
        <Flex gap="sm" mt="lg">
          <Button onClick={handleClickCreateRepo}>リポジトリを作成する</Button>
          <Button variant="outline" onClick={() => setOpened(false)}>
            キャンセル
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
