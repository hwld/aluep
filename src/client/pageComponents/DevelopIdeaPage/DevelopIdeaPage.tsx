import { DevelopForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { useDevelop } from "@/client/features/dev/useDevelop";
import { useDevStatusesQuery } from "@/client/features/dev/useDevStatusesQuery";
import { IdeaSummaryCard } from "@/client/features/idea/IdeaSummaryCard/IdeaSummaryCard";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import {
  CreateRepositoryData,
  DevelopmentFormData,
} from "@/models/development";
import { DevStatusIds } from "@/models/developmentStatus";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { MdComputer } from "react-icons/md";

type Props = {
  idea: Idea;
  restoredValues: CreateRepositoryData;
};
export const DevelopIdeaPage: React.FC<Props> = ({ idea, restoredValues }) => {
  const router = useRouter();

  const { developmentStatuses } = useDevStatusesQuery();

  const {
    mutations: { developMutation },
  } = useDevelop({ ideaId: idea.id });

  const handleDevelopIdea = (data: DevelopmentFormData) => {
    developMutation.mutate(
      { ...data, ideaId: idea.id },
      {
        onSuccess: () => router.replace(Routes.idea(idea.id)),
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={MdComputer} pageName="お題の開発" />
      <Stack w="100%" maw={800} miw={300} m="auto" gap="lg">
        <Stack gap="xs">
          <Text c="gray.5">開発するお題</Text>
          <IdeaSummaryCard idea={idea} />
        </Stack>
        <Stack gap="xs">
          <Text c="gray.5">開発情報</Text>
          <Card>
            <DevelopForm
              developmentStatuses={developmentStatuses}
              onSubmit={handleDevelopIdea}
              onCancel={handleBack}
              ideaId={idea.id}
              submitText="開発する"
              isLoading={developMutation.isLoading || developMutation.isSuccess}
              isRelogined={Object.keys(restoredValues).length > 0}
              defaultValues={{
                type: "createRepository",
                comment: restoredValues?.developmentComment ?? "",
                githubRepositoryName: restoredValues?.repositoryName ?? "",
                githubRepositoryDescription:
                  restoredValues?.repositoryDesc ?? "",
                developmentStatusId: DevStatusIds.IN_PROGRESS,
                githubRepositoryUrl: "",
                developedItemUrl: "",
              }}
            />
          </Card>
        </Stack>
      </Stack>
    </>
  );
};
