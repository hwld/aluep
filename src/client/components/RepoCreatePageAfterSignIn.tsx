import { Box, Card, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { RepositoryFormData } from "../../share/schema";
import { useGitHubRepoCreate } from "../hooks/useGitHubRepoCreate";
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
  const createRepositoryMutation = useGitHubRepoCreate(themeId);

  const handleGoJoinPage = () => {
    router.push(`/themes/${themeId}/join`);
  };

  const handleCreateRepository = (data: RepositoryFormData) => {
    createRepositoryMutation.mutate(data, {
      onSuccess: (data) => {
        const url = new URL(`${window.location.origin}/themes/${themeId}/join`);
        url.searchParams.set("repoUrl", data.repoUrl);
        router.replace(url);
      },
    });
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
