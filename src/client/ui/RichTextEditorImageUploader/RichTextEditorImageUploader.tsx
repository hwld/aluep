import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { Routes } from "@/share/routes";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { ChangeEventHandler, useRef, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { z } from "zod";
import classes from "./RichTextEditorImageUploader.module.css";

type Props = {};

const uploadNotificationId = "upload-image";

export const RichTextEditorImageUploader: React.FC<Props> = () => {
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
      showErrorNotification(
        {
          title: "画像のアップロード",
          message: "画像をアップロードすることができませんでした。",
          loading: false,
          autoClose: true,
        },
        { update: true, id: uploadNotificationId }
      );
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
      <TbPhotoPlus color="var(--mantine-color-gray-7)" />
    </RichTextEditor.Control>
  );
};
