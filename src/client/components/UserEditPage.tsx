import { Box, Card, Flex, Title, useMantineTheme } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { RouterInputs } from "../../server/trpc";
import { ProfileFormData } from "../../share/schema";
import { trpc } from "../trpc";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "../utils";
import { UserIconFormDialog } from "./UserIconFormModal";
import { UserProfileForm } from "./UserProfileForm";

const uploadNotificationId = "upload-icon";

type Props = { user: Session["user"] };
export const UserEditPage: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();
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
      disallowClose: true,
    });
    try {
      const response = await fetch("/api/upload-avatar", {
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
      },
      { update: true, id: uploadNotificationId }
    );
    // 更新なしでアイコンを反映させたいが、方法がわからない
    router.reload();
  };

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["me"]["update"]) => {
      return trpc.me.update.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "プロフィールの更新",
        message: "プロフィールを更新しました。",
      });
      router.push(`/users/${user.id}`);
    },
    onError: () => {
      showErrorNotification({
        title: "プロフィールの更新",
        message: "プロフィールを更新できませんでした。",
      });
    },
  });

  const handleUpdateUser = ({ name, profile }: ProfileFormData) => {
    updateMutation.mutate({ name, profile });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box w="100%" maw={800} miw={400} m="auto">
      <Flex align="center" gap="xs">
        <RiEdit2Line size="30px" color={mantineTheme.colors.red[7]} />
        <Title order={3}>プロフィールの更新</Title>
      </Flex>
      <Card mt="md">
        <Flex gap="md">
          <UserIconFormDialog
            userIconUrl={user.image}
            onSubmit={handleUploadIcon}
            submitting={uploading}
          />
          <Box sx={{ flexGrow: 1 }}>
            <UserProfileForm
              submitText="更新する"
              onSubmit={handleUpdateUser}
              onCancel={handleCancel}
              defaultValues={{
                name: user.name ?? "",
                profile: user.profile ?? "",
              }}
              isLoading={updateMutation.isLoading || updateMutation.isSuccess}
            />
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};
