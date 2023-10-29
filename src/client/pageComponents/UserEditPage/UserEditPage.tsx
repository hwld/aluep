import { UserIconFormModal } from "@/client/features/user/UserIconFormModal/UserIconFormModal";
import { UserProfileForm } from "@/client/features/user/UserProfileForm/UserProfileForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { ProfileFormData } from "@/models/user";
import { Routes } from "@/share/routes";
import { Box, Card, Flex } from "@mantine/core";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { TbEdit } from "react-icons/tb";

const uploadNotificationId = "upload-icon";

type Props = { user: Session["user"] };
export const UserEditPage: React.FC<Props> = ({ user }) => {
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

  const updateMutation = trpc.me.update.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "プロフィールの更新",
        message: "プロフィールを更新しました。",
      });
      router.push(Routes.user(user.id));
    },
    onError: () => {
      showErrorNotification({
        title: "プロフィールの更新",
        message: "プロフィールを更新できませんでした。",
      });
    },
  });

  const handleUpdateUser = ({
    name,
    profile,
    welcomeMessageHidden,
  }: ProfileFormData) => {
    updateMutation.mutate({ name, profile, welcomeMessageHidden });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <PageHeader icon={TbEdit} pageName="ユーザーの編集" />
      <Box w="100%" maw={800} miw={400} m="auto">
        <Card mt="md">
          <Flex gap="md">
            <UserIconFormModal
              userIconUrl={user.image}
              onSubmit={handleUploadIcon}
              submitting={uploading}
            />
            <Box style={{ flexGrow: 1 }}>
              <UserProfileForm
                submitText="更新する"
                onSubmit={handleUpdateUser}
                onCancel={handleCancel}
                defaultValues={{
                  name: user.name ?? "",
                  profile: user.profile ?? "",
                  welcomeMessageHidden: user.welcomeMessageHidden,
                }}
                isLoading={updateMutation.isLoading || updateMutation.isSuccess}
              />
            </Box>
          </Flex>
        </Card>
      </Box>
    </>
  );
};
