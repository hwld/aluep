import { Card, Stack, Text, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { MdOutlineEdit } from "react-icons/md";
import { Development } from "../../server/models/development";
import { Idea } from "../../server/models/idea";
import { DevelopmentStatusIds } from "../../share/consts";
import { CreateRepositoryData, DevelopmentFormData } from "../../share/schema";
import { useDevelop } from "../features/development/useDevelop";
import { useDevelopmentStatusesQuery } from "../features/development/useDevelopmentStatusesQuery";
import { DevelopmentForm } from "../features/idea/DevelopmentForm";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import { PageHeader } from "../ui/PageHeader";

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

  const handleUpdateDevelopment = (data: DevelopmentFormData) => {
    updateDevelopmentMutation.mutate({
      ...data,
      developmentId: development.id,
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={MdOutlineEdit} pageName="開発情報の編集" />
      <Stack w="100%" maw={800} miw={300} m="auto" spacing="lg">
        <Stack spacing="xs">
          <Text c="gray.5">開発しているお題</Text>
          <IdeaSummaryCard idea={idea} />
        </Stack>
        <Stack spacing="xs">
          <Text c="gray.5">開発情報</Text>
          <Card>
            <DevelopmentForm
              developmentStatuses={developmentStatuses}
              onSubmit={handleUpdateDevelopment}
              onCancel={handleBack}
              ideaId={idea.id}
              isRelogined={Object.keys(restoredValues).length > 0}
              defaultValues={{
                comment:
                  restoredValues.developmentComment ?? development.comment,
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
    </>
  );
};
