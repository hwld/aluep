import { trpc } from "@/client/lib/trpc";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { UploadedImageCard } from "@/client/ui/UploadedImageCard/UploadedImageCard";
import { Center, Flex } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

type Props = {};

export const UserUploadedImages: React.FC<Props> = () => {
  const { data: images } = trpc.uploadedImage.getAll.useQuery(undefined, {
    initialData: [],
  });

  return (
    <>
      <PageHeader icon={IconPhoto} pageName="アップロードした画像" />
      {images.length === 0 ? (
        <Center mt={100}>
          <EmptyContentItem
            icon={
              <IconPhoto
                width={120}
                height={120}
                color="var(--mantine-color-gray-7)"
              />
            }
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
            />
          ))}
        </Flex>
      )}
    </>
  );
};
