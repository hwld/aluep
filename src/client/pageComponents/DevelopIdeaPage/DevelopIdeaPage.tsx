import { DevForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { useDevMutations } from "@/client/features/dev/useDevMutations";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { DevFormData } from "@/models/dev";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Card, Stack } from "@mantine/core";
import { SvgCode } from "@tabler/icons-react";
import { useRouter } from "next/router";

type Props = {
  idea: Idea;
};
export const DevelopIdeaPage: React.FC<Props> = ({ idea }) => {
  const router = useRouter();

  const { developMutation } = useDevMutations();

  const handleDevelopIdea = (data: DevFormData) => {
    developMutation.mutate(
      { ...data, ideaId: idea.id },
      { onSuccess: ({ devId }) => router.replace(Routes.dev(devId)) }
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={SvgCode} pageName="お題の開発" />
      <Stack w="100%" maw={800} miw={300} m="auto" gap="lg">
        <Stack gap="xs">
          <MutedText>開発するお題</MutedText>
          <IdeaSummaryHeader idea={idea} />
        </Stack>
        <Stack gap="xs">
          <MutedText>開発情報</MutedText>
          <Card>
            <DevForm
              onSubmit={handleDevelopIdea}
              onCancel={handleBack}
              submitText="開発する"
              isLoading={developMutation.isLoading || developMutation.isSuccess}
              defaultValues={{
                comment: "",
                status: "IN_PROGRESS",
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
