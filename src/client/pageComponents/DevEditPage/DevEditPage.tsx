import { DevForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { useDevelop } from "@/client/features/dev/useDevelop";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Dev, DevFormData } from "@/models/dev";
import { Idea } from "@/models/idea";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { MdOutlineEdit } from "react-icons/md";

type Props = {
  idea: Idea;
  dev: Dev;
};
export const DevEditPage: React.FC<Props> = ({ idea, dev }) => {
  const router = useRouter();

  const {
    mutations: { updateDevMutation },
  } = useDevelop({ ideaId: idea.id });

  const handleUpdateDev = (data: DevFormData) => {
    updateDevMutation.mutate({
      ...data,
      ideaId: idea.id,
      devId: dev.id,
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
            <DevForm
              onSubmit={handleUpdateDev}
              onCancel={handleBack}
              ideaId={idea.id}
              defaultValues={{
                comment: dev.comment,
                developedItemUrl: dev.developedItemUrl,
                status: dev.status,
                githubRepositoryUrl: dev.githubUrl,
              }}
              submitText="更新する"
              isLoading={
                updateDevMutation.isLoading || updateDevMutation.isSuccess
              }
            />
          </Card>
        </Stack>
      </Stack>
    </>
  );
};
