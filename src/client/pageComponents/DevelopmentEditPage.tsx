import { useDevelop } from "@/client/features/development/useDevelop";
import { useDevelopmentStatusesQuery } from "@/client/features/development/useDevelopmentStatusesQuery";
import {
  DevelopmentForm,
  DevelopmentFormDefaultValues,
} from "@/client/features/idea/DevelopmentForm";
import { IdeaSummaryCard } from "@/client/features/idea/IdeaSummaryCard";
import { PageHeader } from "@/client/ui/PageHeader";
import { Development } from "@/server/models/development";
import { Idea } from "@/server/models/idea";
import { DevelopmentStatusIds } from "@/share/consts";
import {
  CreateRepositoryData,
  DevelopmentFormData,
} from "@/share/schema/development";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdOutlineEdit } from "react-icons/md";

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

  const { developmentStatuses } = useDevelopmentStatusesQuery();

  const {
    mutations: { updateDevelopmentMutation },
  } = useDevelop({ ideaId: idea.id });

  const handleUpdateDevelopment = (data: DevelopmentFormData) => {
    updateDevelopmentMutation.mutate({
      ...data,
      ideaId: idea.id,
      developmentId: development.id,
    });
  };

  const handleBack = () => {
    router.back();
  };

  const developmentFormDefaultValues =
    useMemo((): DevelopmentFormDefaultValues => {
      const base: DevelopmentFormDefaultValues = {
        comment: development.comment,
        developedItemUrl: development.developedItemUrl,
        developmentStatusId: DevelopmentStatusIds.IN_PROGRESS,
        githubRepositoryDescription: "",
        githubRepositoryName: "",
        githubRepositoryUrl: "",
        type: "createRepository",
      };

      // 復元されたフィールドが一つ以上あれば、リポジトリの作成フォームを
      // 選択していると仮定する
      if (Object.keys(restoredValues).length > 0) {
        return {
          ...base,
          type: "createRepository",
          comment: restoredValues.developmentComment ?? "",
          developedItemUrl: restoredValues.developedItemUrl ?? "",
          githubRepositoryName: restoredValues.repositoryName ?? "",
          githubRepositoryDescription: restoredValues.repositoryDesc ?? "",
        };
      } else {
        return {
          ...base,
          type: "referenceRepository",
          githubRepositoryUrl: development.githubUrl,
          developmentStatusId: development.status.id,
        };
      }
    }, [
      development.comment,
      development.developedItemUrl,
      development.githubUrl,
      development.status.id,
      restoredValues,
    ]);

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
              defaultValues={developmentFormDefaultValues}
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
