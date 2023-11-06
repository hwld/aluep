import { IdeaForm } from "@/client/features/idea/IdeaForm/IdeaForm";
import { useAllTagsQuery } from "@/client/features/idea/useAllTagsQuery";
import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { IdeaFormData } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Box, Card } from "@mantine/core";
import { IconFilePlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

export const IdeaCreate: React.FC = () => {
  const { allTags } = useAllTagsQuery();
  const router = useRouter();

  const createMutate = useMutationWithNotification(trpc.idea.create, {
    succsesNotification: {
      title: "お題の投稿",
      message: "お題を投稿しました。",
    },
    errorNotification: {
      title: "お題の投稿",
      message: "お題が投稿できませんでした。",
    },
    onSuccess: ({ ideaId }) => router.replace(Routes.idea(ideaId)),
  });

  const handleCreateIdea = (data: IdeaFormData) => {
    createMutate.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={IconFilePlus} pageName="お題の投稿" />
      <Box w="100%" maw={800} miw={300} m="auto">
        <Card mt="md" style={{ position: "static" }}>
          <IdeaForm
            submitText="投稿する"
            onSubmit={handleCreateIdea}
            onCancel={handleCancel}
            allTags={allTags}
            // お題の投稿に成功したら遷移するので、isSuccessがtrueでも遷移するまでloading状態にさせる
            isLoading={createMutate.isLoading || createMutate.isSuccess}
          />
        </Card>
      </Box>
    </>
  );
};
