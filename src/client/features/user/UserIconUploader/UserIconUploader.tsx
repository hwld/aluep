import { UserIconFormModal } from "@/client/features/user/UserIconUploader/UserIconFormModal/UserIconFormModal";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "@/client/lib/notification";
import { User } from "@/models/user";
import { Routes } from "@/share/routes";
import { useRouter } from "next/router";
import { useState } from "react";

const uploadNotificationId = "upload-icon";

type Props = { user: User };

export const UserIconUploader: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUploadIcon = async (iconFile: File) => {
    const formData = new FormData();
    formData.append("avatar", iconFile);

    setUploading(true);
    showLoadingNotification({
      id: uploadNotificationId,
      loading: true,
      title: "ユーザーアイコンの更新",
      message:
        "ユーザーアイコンをアップロードしています。しばらくお待ちください...",
      autoClose: false,
    });
    try {
      const response = await fetch(Routes.api.uploadAvatar, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error();
      }
    } catch {
      showErrorNotification(
        {
          title: "ユーザーアイコンの更新",
          message: "ユーザーアイコンを更新できませんでした。",
          loading: false,
          autoClose: true,
        },
        { update: true, id: uploadNotificationId }
      );
      return;
    } finally {
      setUploading(false);
    }

    showSuccessNotification(
      {
        id: uploadNotificationId,
        title: "ユーザーアイコンの更新",
        message: "ユーザーアイコンを更新しました。",
        loading: false,
        autoClose: true,
      },
      { update: true, id: uploadNotificationId }
    );
    // 更新なしでアイコンを反映させたいが、方法がわからない
    router.reload();
  };

  return (
    <UserIconFormModal
      userIconUrl={user.image}
      onSubmit={handleUploadIcon}
      submitting={uploading}
    />
  );
};
