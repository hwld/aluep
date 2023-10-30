import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { SvgPhotoPlus } from "@/client/ui/Icons";
import {
  Bytes,
  TOTAL_UPLOAD_IMAGE_LIMIT_MB,
  UPLOAD_IMAGE_LIMIT_MB,
} from "@/share/consts";
import { Routes } from "@/share/routes";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { ChangeEventHandler, useRef, useState } from "react";
import { z } from "zod";
import classes from "./RichTextEditorImageUploader.module.css";

type Props = {};

const uploadNotificationId = "upload-image";

export const RichTextEditorImageUploader: React.FC<Props> = () => {
  const {
    data: { totalSize },
  } = trpc.uploadedImage.getTotalSize.useQuery(undefined, {
    initialData: { totalSize: 0 },
  });
  const ref = useRef<HTMLInputElement | null>(null);
  const { editor } = useRichTextEditorContext();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    ref.current?.click();
  };

  const uploadImageWithLoading: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    setLoading(true);
    showLoadingNotification({
      id: uploadNotificationId,
      loading: true,
      title: "画像のアップロード",
      message: "画像をアップロードしています。しばらくお待ち下さい...",
      autoClose: false,
    });

    try {
      await uploadImageAndSetImage(e);
    } catch (e) {
      let message: string = "画像をアップロードすることができませんでした。";
      if (e instanceof Error && e.message) {
        message = e.message;
      }
      showErrorNotification(
        {
          title: "画像のアップロード",
          message: message,
          loading: false,
          autoClose: 10000,
        },
        { update: true, id: uploadNotificationId }
      );
      return;
    } finally {
      setLoading(false);
    }

    showSuccessNotification(
      {
        id: uploadNotificationId,
        title: "画像のアップロード",
        message: "画像のアップロードが完了しました。",
        autoClose: true,
        loading: false,
      },
      { update: true, id: uploadNotificationId }
    );
  };

  const uploadImageAndSetImage: ChangeEventHandler<HTMLInputElement> = async ({
    target,
  }) => {
    const file = target.files?.[0];
    if (!file) {
      return;
    }
    target.value = "";

    // ファイルのアップロードサイズはサーバーに送る前にも検証する
    if (file.size > UPLOAD_IMAGE_LIMIT_MB * Bytes.MB) {
      throw new Error(
        `ユーザーがアップロードできる画像のサイズを超えています。アップロードできる画像は ${UPLOAD_IMAGE_LIMIT_MB} MBまでです。`
      );
    }

    // ユーザーがアップロードできる上限を超えた場合
    const availableBytes = TOTAL_UPLOAD_IMAGE_LIMIT_MB * Bytes.MB - totalSize;
    if (file.size > availableBytes) {
      throw new Error(
        `ユーザーがアップロードできる画像の上限を超えました。プロフィールからアップロードした画像を削除することができます。`
      );
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(Routes.api.uploadIdeaImage, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error();
    }

    const json = await response.json();
    const { imageUrl } = z.object({ imageUrl: z.string().url() }).parse(json);

    editor?.commands.setImage({
      src: imageUrl,
    });
  };

  return (
    <RichTextEditor.Control
      onClick={handleClick}
      disabled={loading}
      className={classes.control}
      title="upload image"
    >
      <input
        ref={ref}
        hidden
        type="file"
        accept="image/*"
        onChange={uploadImageWithLoading}
      />
      <SvgPhotoPlus color="var(--mantine-color-gray-7)" />
    </RichTextEditor.Control>
  );
};
