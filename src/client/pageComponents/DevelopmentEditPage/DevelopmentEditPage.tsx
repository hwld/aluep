import { DevelopForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { useDevelop } from "@/client/features/dev/useDevelop";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Development, DevelopmentFormData } from "@/models/development";
import { DevStatusIds } from "@/models/developmentStatus";
import { Idea } from "@/models/idea";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { MdOutlineEdit } from "react-icons/md";

type Props = {
  idea: Idea;
  development: Development;
};
export const DevelopmentEditPage: React.FC<Props> = ({ idea, development }) => {
  const router = useRouter();

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

  return (
    <>
      <PageHeader icon={MdOutlineEdit} pageName="開発情報の編集" />
      <Stack w="100%" maw={800} miw={300} m="auto" gap="lg">
        <Stack gap="xs">
          <Text c="gray.5">開発しているお題</Text>
          <IdeaSummaryHeader idea={idea} />
        </Stack>
        <Stack gap="xs">
          <Text c="gray.5">開発情報</Text>
          <Card>
            <DevelopForm
              onSubmit={handleUpdateDevelopment}
              onCancel={handleBack}
              ideaId={idea.id}
              defaultValues={{
                comment: development.comment,
                developedItemUrl: development.developedItemUrl,
                developmentStatusId: DevStatusIds.IN_PROGRESS,
                githubRepositoryUrl: "",
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
