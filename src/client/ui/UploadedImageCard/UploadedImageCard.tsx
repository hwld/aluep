import { formatBytes, formatDateTime } from "@/client/lib/utils";
import { AppImage } from "@/client/ui/AppImage/AppImage";
import { DeleteUploadedImageModal } from "@/client/ui/DeleteUploadedImageModal/DeleteUploadedImageModal";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import {
  Button,
  Card,
  CopyButton,
  Divider,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

type Props = {
  imageUrl: string;
  created: string | undefined;
  size: number;
};

// ローカルでは、アップロードしたsvgがちゃんと表示できない
// 現在のサーバー側の実装では、ローカル環境ではfake-gcs-serverを使用しており、
// contentTypeをファイルを作成したあとに書き換えているのだが、これが動いてなく、application/octet-streamが返ってきてしまう
// https://github.com/fsouza/fake-gcs-server/issues/273
export const UploadedImageCard: React.FC<Props> = ({
  imageUrl,
  size,
  created,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  useEffect(() => {
    if (!imageRef.current) {
      return;
    }
    imageRef.current.src = imageRef.current.src;
  }, []);

  return (
    <>
      <Card w="fit-content">
        <Stack>
          <Group align="normal">
            <AppImage
              src={imageUrl}
              width={150}
              height={150}
              alt="uploaded-image"
              // これつけないと元画像が1:1じゃないと歪む
              priority
              style={{
                backgroundColor: "var(--mantine-color-gray-3)",
                borderRadius: "var(--mantine-radius-md)",
              }}
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
