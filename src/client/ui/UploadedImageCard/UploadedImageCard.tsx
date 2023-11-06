import { formatBytes, formatDateTime } from "@/client/lib/utils";
import { DeleteUploadedImageModal } from "@/client/ui/DeleteUploadedImageModal/DeleteUploadedImageModal";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import {
  Button,
  Card,
  CopyButton,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconTrash } from "@tabler/icons-react";

type Props = {
  imageUrl: string;
  created: string | undefined;
  size: number;
};

// TODO: ここ以外でもアップロードしたsvgがちゃんと表示できてなさそう
export const UploadedImageCard: React.FC<Props> = ({
  imageUrl,
  size,
  created,
}) => {
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  return (
    <>
      <Card w="fit-content">
        <Stack>
          <Group align="normal">
            <Image
              radius="md"
              alt="image"
              src={imageUrl}
              fallbackSrc="/alert.svg"
              fit="contain"
              w={150}
              h={150}
              bg="gray.3"
            />
            <Stack gap="xs">
              {!isNaN(size) && (
                <Stack gap={0}>
                  <MutedText>サイズ</MutedText>
                  <Text>{formatBytes(size)}</Text>
                </Stack>
              )}
              {created && (
                <Stack gap={0}>
                  <MutedText>アップロード日</MutedText>
                  <Text>{formatDateTime(new Date(created))}</Text>
                </Stack>
              )}
            </Stack>
          </Group>
          <Divider />
          <Stack justify="space-between">
            <Group>
              <Button
                leftSection={
                  <IconTrash
                    width={20}
                    height={20}
                    color="var(--mantine-color-gray-1)"
                  />
                }
                style={{ flex: 1 }}
                onClick={openDeleteModal}
              >
                削除
              </Button>
              <CopyButton value={imageUrl}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={"✅" + "  " + "コピーしました"}
                    disabled={!copied}
                    opened={copied}
                    styles={{ tooltip: { fontSize: 12 } }}
                  >
                    <Button
                      bg="gray.7"
                      c="gray.1"
                      leftSection={
                        <IconCopy
                          width={20}
                          height={20}
                          color="var(--mantine-color-gray-1)"
                        />
                      }
                      style={{ flex: 1 }}
                      onClick={copy}
                    >
                      URLをコピー
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <DeleteUploadedImageModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        imageUrl={imageUrl}
      />
    </>
  );
};
