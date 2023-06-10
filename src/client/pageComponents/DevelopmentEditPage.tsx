import { Card, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { MdComputer } from "react-icons/md";
import { Development } from "../../server/models/development";
import { Idea } from "../../server/models/idea";
import { DevelopmentStatusIds } from "../../share/consts";
import { CreateRepositoryData, DevelopFormData } from "../../share/schema";
import { useDevelopmentStatusesQuery } from "../features/development/useDevelopmentStatusesQuery";
import { DevelopForm } from "../features/idea/DevelopForm";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import { useDevelop } from "../features/idea/useDevelop";

type Props = {
  idea: Idea;
  development: Development;
  restoredValues: CreateRepositoryData;
};
export const DevelopmentEditPage: React.FC<Props> = ({
  idea,
  development,
  restoredValues,
}) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const { developmentStatuses } = useDevelopmentStatusesQuery();

  const {
    mutations: { updateDevelopmentMutation },
  } = useDevelop(idea.id);

  const handleUpdateDevelopment = (data: DevelopFormData) => {
    updateDevelopmentMutation.mutate({
      ...data,
      developmentId: development.id,
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Stack w="100%" maw={800} miw={300} m="auto" spacing="lg">
      <Flex align="center" gap="xs">
        <MdComputer
          size="30px"
          color={mantineTheme.colors.red[7]}
          style={{ marginTop: "3px" }}
        />
        <Title order={3}>お題開発情報の更新</Title>
      </Flex>
      <Stack spacing="xs">
        <Text c="gray.5">開発しているお題</Text>
        <IdeaSummaryCard idea={idea} />
      </Stack>
      <Stack spacing="xs">
        <Text c="gray.5">開発情報</Text>
        <Card>
          <DevelopForm
            developmentStatuses={developmentStatuses}
            onSubmit={handleUpdateDevelopment}
            onCancel={handleBack}
            ideaId={idea.id}
            isRelogined={Object.keys(restoredValues).length > 0}
            defaultValues={{
              comment: restoredValues.developmentComment ?? development.comment,
              developmentStatusId: DevelopmentStatusIds.IN_PROGRESS,
              // 復元されたフィールドが1つ以上あれば、リポジトリの作成を選択していたと解釈する。
              ...(Object.keys(restoredValues).length > 0
                ? {
                    type: "createRepository",
                    githubRepositoryName: restoredValues.repositoryName ?? "",
                    githubRepositoryDescription:
                      restoredValues.repositoryDesc ?? "",
                  }
                : {
                    type: "referenceRepository",
                    githubRepositoryUrl: development.githubUrl,
                    developmentStatusId: development.status.id,
                  }),
            }}
            submitText="更新する"
            isLoading={
              updateDevelopmentMutation.isLoading ||
              updateDevelopmentMutation.isSuccess
            }
          />
        </Card>
      </Stack>
    </Stack>
  );
};
