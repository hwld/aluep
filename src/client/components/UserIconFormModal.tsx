import { Text, UnstyledButton } from "@mantine/core";
import { useRef, useState } from "react";
import { AppModal } from "./AppModal";
import {
  ImageCropper,
  imageCropperSize,
  imageCropperStep,
  ImageInfo,
} from "./ImageCropper";
import { UserIcon } from "./UserIcon";

type Props = {
  userIconUrl: string | null | undefined;
  onSubmit: (iconFile: File) => void;
  submitting?: boolean;
};

export const UserIconFormDialog: React.FC<Props> = ({
  userIconUrl,
  onSubmit,
  submitting = false,
}) => {
  const [opened, setOpened] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [iconObjectUrl, setIconObjectUrl] = useState("");
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>(undefined);

  // 領域をクリックされるとファイル選択のダイアログを開く
  const handleClick = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const handleChangeIconFile: React.ChangeEventHandler<
    HTMLInputElement
  > = async ({ target }) => {
    const file = target.files?.[0];
    if (!file) {
      return;
    }

    // 以前作成したオブジェクトを削除する
    URL.revokeObjectURL(iconObjectUrl);

    const objectUrl = URL.createObjectURL(file);
    setIconObjectUrl(objectUrl);

    // img要素を作成する
    const newIcon = new Image();
    newIcon.src = objectUrl;

    // 画像情報をリセットする
    setImageInfo(undefined);
    return await new Promise((resolve) => {
      // 画像のロードが終わったら
      newIcon.onload = () => {
        // ImageCropperのサイズに合うようにscaleを設定する
        const actualDefaultScale =
          imageCropperSize / Math.max(newIcon.width, newIcon.height);

        // ImageCropperのステップに単位を合わせる
        const defaultScale =
          Math.round(actualDefaultScale / imageCropperStep) * imageCropperStep;

        setImageInfo({ image: newIcon, defaultScale });
        setOpened(true);

        // inputをリセットする
        target.value = "";
        resolve(undefined);
      };
    });
  };

  const handleCompleteCrop = (base64Icon: string) => {
    // base64をFileオブジェクトに変換する
    const bin = window.atob(base64Icon.replace(/^.*,/, ""));

    let buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }

    const iconFile = new File([buffer.buffer], "icon.png", {
      type: "image/png",
    });

    onSubmit(iconFile);

    setOpened(false);
  };

  return (
    <>
      <UnstyledButton
        onClick={handleClick}
        disabled={submitting}
        h="min-content"
        p="xs"
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.xs,
          alignItems: "center",
          borderRadius: theme.radius.md,
          transition: "150ms",
          "&:not(&:disabled)&:hover": {
            backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
            "& *": { opacity: 0.9 },
          },
          "&:disabled": {
            backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
            "& *": { opacity: 0.5 },
            cursor: "not-allowed",
          },
        })}
      >
        <input
          ref={fileInputRef}
          onChange={handleChangeIconFile}
          type="file"
          hidden
          accept="image/*"
        />
        <UserIcon iconSrc={userIconUrl} size="xl" />
        <Text size="sm" color="gray.6">
          変更する
        </Text>
      </UnstyledButton>

      <AppModal
        size={imageCropperSize + 30}
        padding={15}
        title="ユーザーアイコンの変更"
        opened={opened && !!imageInfo}
        onClose={() => setOpened(false)}
      >
        {imageInfo && (
          <ImageCropper info={imageInfo} onCompleteCrop={handleCompleteCrop} />
        )}
      </AppModal>
    </>
  );
};
