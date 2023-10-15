import { DevForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { useDevelop } from "@/client/features/dev/useDevelop";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { DevFormData } from "@/models/dev";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { MdComputer } from "react-icons/md";

type Props = {
  idea: Idea;
};
export const DevelopIdeaPage: React.FC<Props> = ({ idea }) => {
  const router = useRouter();

  const {
    mutations: { developMutation },
  } = useDevelop({ ideaId: idea.id });

  const handleDevelopIdea = (data: DevFormData) => {
    developMutation.mutate(
      { ...data, ideaId: idea.id },
      { onSuccess: () => router.replace(Routes.idea(idea.id)) }
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
          <IdeaSummaryHeader idea={idea} />
        </Stack>
        <Stack gap="xs">
          <Text c="gray.5">開発情報</Text>
          <Card>
            <DevForm
              onSubmit={handleDevelopIdea}
              onCancel={handleBack}
              ideaId={idea.id}
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
