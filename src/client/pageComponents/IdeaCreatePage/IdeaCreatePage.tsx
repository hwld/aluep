import { IdeaForm } from "@/client/features/idea/IdeaForm/IdeaForm";
import { useAllTagsQuery } from "@/client/features/idea/useAllTagsQuery";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { IdeaFormData } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Box, Card } from "@mantine/core";
import { useRouter } from "next/router";
import { TbFilePlus } from "react-icons/tb";

export const IdeaCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();
  const router = useRouter();

  const createMutate = trpc.idea.create.useMutation({
    onSuccess: ({ ideaId }) => {
      showSuccessNotification({
        title: "お題の投稿",
        message: "お題を投稿しました。",
      });
      router.replace(Routes.idea(ideaId));
    },
    onError: () => {
      showErrorNotification({
        title: "お題の投稿",
        message: "お題が投稿できませんでした。",
      });
    },
  });

  const handleCreateIdea = (data: IdeaFormData) => {
    createMutate.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={TbFilePlus} pageName="お題の投稿" />
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
