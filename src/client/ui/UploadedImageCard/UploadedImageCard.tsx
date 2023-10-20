import { formatBytes, formatDateTime } from "@/client/lib/utils";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
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
import { TbCopy, TbTrash } from "react-icons/tb";

type Props = {
  imageUrl: string;
  created: string | undefined;
  size: number;
  onDelete: (url: string) => void;
  isDeleting?: boolean;
};

export const UploadedImageCard: React.FC<Props> = ({
  imageUrl,
  size,
  created,
  onDelete,
  isDeleting,
}) => {
  const [isDeleteModalOpen, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    onDelete(imageUrl);
  };

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
                  <TbTrash size={20} color="var(--mantine-color-gray-1)" />
                }
                style={{ flex: 1 }}
                onClick={open}
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
                        <TbCopy size={20} color="var(--mantine-color-gray-1)" />
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

      <AppConfirmModal
        title="画像の削除"
        message={
          <>
            アップロードした画像を削除してもよろしいですか？
            <br />
            お題に画像が含まれている場合、正しく表示されなくなる可能性があります。
          </>
        }
        opened={isDeleteModalOpen}
        onClose={close}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        confirmIcon={TbTrash}
        confirmText="削除する"
      />
    </>
  );
};
