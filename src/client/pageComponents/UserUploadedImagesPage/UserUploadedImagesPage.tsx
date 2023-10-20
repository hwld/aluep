import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { UploadedImageCard } from "@/client/ui/UploadedImageCard/UploadedImageCard";
import { Center, Flex } from "@mantine/core";
import { TbPhoto } from "react-icons/tb";

type Props = {};

export const UserUploadedImagesPage: React.FC<Props> = () => {
  const { data: images } = trpc.user.getUserUploadedImages.useQuery(undefined, {
    initialData: [],
  });
  const deleteMutation = trpc.user.deleteUserUploadedImage.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "画像の削除",
        message: "画像を削除しました",
      });
    },
    onError: () => {
      showErrorNotification({
        title: "画像の削除",
        message: "お題を削除できませんでした",
      });
    },
  });

  const handleDelete = (imageUrl: string) => {
    deleteMutation.mutate({ imageUrl });
  };

  return (
    <>
      <PageHeader icon={TbPhoto} pageName="アップロードした画像" />
      {images.length === 0 ? (
        <Center mt={100}>
          <EmptyContentItem
            icon={<TbPhoto size={120} color="var(--mantine-color-gray-7)" />}
            text="画像がアップロードされていません"
            description={
              <>画像をアップロードして、お題に画像を添付することができます。</>
            }
          />
        </Center>
      ) : (
        <Flex wrap="wrap" gap="xs" maw={1200} justify="center" m="auto">
          {images.map(({ url, created, size }) => (
            <UploadedImageCard
              key={url}
              imageUrl={url}
              created={created}
              size={size}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isLoading}
            />
          ))}
        </Flex>
      )}
    </>
  );
};
