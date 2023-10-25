import { DevForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { useDevMutations } from "@/client/features/dev/useDevMutations";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Dev, DevFormData } from "@/models/dev";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Card, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { TbEdit } from "react-icons/tb";

type Props = {
  idea: Idea | undefined;
  dev: Dev;
};
export const DevEditPage: React.FC<Props> = ({ idea, dev }) => {
  const router = useRouter();

  const { updateDevMutation } = useDevMutations();

  const handleUpdateDev = (data: DevFormData) => {
    updateDevMutation.mutate(
      { ...data, devId: dev.id },
      {
        onSuccess: () => {
          router.push(Routes.dev(dev.id));
        },
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={TbEdit} pageName="開発情報の編集" />
      <Stack w="100%" maw={800} miw={300} m="auto" gap="lg">
        <Stack gap="xs">
          <MutedText>開発しているお題</MutedText>
          <IdeaSummaryHeader idea={idea} />
        </Stack>
        <Stack gap="xs">
          <MutedText>開発情報</MutedText>
          <Card>
            <DevForm
              onSubmit={handleUpdateDev}
              onCancel={handleBack}
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
