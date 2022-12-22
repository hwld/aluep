import { Box, Card, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { RepositoryFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { RepositoryForm } from "./RepositoryForm";

type Props = {
  themeId: string;
  repoFormData?: RepositoryFormData;
};

export const RepoCreatePageAfterSignIn: React.FC<Props> = ({
  themeId,
  repoFormData,
}) => {
  const router = useRouter();

  const createRepositoryMutation = useMutation({
    mutationFn: (data: RepositoryFormData) => {
      return trpc.github.createRepo.mutate(data);
    },
    onSuccess: (data) => {
      showSuccessNotification({
        title: "リポジトリの作成",
        message: "リポジトリを作成しました。",
      });

      const url = new URL(`${window.location.origin}/themes/${themeId}/join`);
      url.searchParams.set("repoUrl", data.repoUrl);
      router.replace(url);
    },
    onError: (e) => {
      showErrorNotification({
        title: "リポジトリの作成",
        message:
          "リポジトリを作成できませんでした。\n再ログインしてもう一度試してください。",
      });
    },
  });

  const handleGoJoinPage = () => {
    router.push(`/themes/${themeId}/join`);
  };

  const handleCreateRepository = (data: RepositoryFormData) => {
    createRepositoryMutation.mutate(data);
  };

  return (
    <Box w={800} m="auto">
      <Title mt="xl" order={3}>
        GitHubリポジトリの作成
      </Title>
      <Text mt={5} size="sm" color="red">
        GitHubリポジトリを作成することができなかったため、再ログインを行いました。
        <br />
        もう一度「リポジトリを作成する」ボタンを押して、リポジトリを作成してください。
      </Text>

      <Card mt="md">
        <RepositoryForm
          onSubmit={handleCreateRepository}
          onCancel={handleGoJoinPage}
          isSubmitting={createRepositoryMutation.isLoading}
          defaultValues={repoFormData}
        />
      </Card>
    </Box>
  );
};
