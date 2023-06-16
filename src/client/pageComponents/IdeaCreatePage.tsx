import { Box, Card, useMantineTheme } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { MdPostAdd } from "react-icons/md";
import { Routes } from "../../share/routes";
import { IdeaFormData } from "../../share/schema";
import { IdeaForm } from "../features/idea/IdeaForm";
import { useAllTagsQuery } from "../features/idea/useAllTagsQuery";
import { trpc } from "../lib/trpc";
import { showErrorNotification, showSuccessNotification } from "../lib/utils";
import { PageHeader } from "../ui/PageHeader";

export const IdeaCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const createMutate = useMutation({
    mutationFn: (data: IdeaFormData) => {
      return trpc.idea.create.mutate(data);
    },
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
      <PageHeader icon={MdPostAdd} pageName="お題の投稿" />
      <Box w="100%" maw={800} miw={300} m="auto">
        <Card mt="md" sx={{ position: "static" }}>
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
