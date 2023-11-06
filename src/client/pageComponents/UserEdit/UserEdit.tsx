import { UserProfileForm } from "@/client/features/user/UserProfileForm/UserProfileForm";
import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { ProfileFormData, User } from "@/models/user";
import { Routes } from "@/share/routes";
import { Box, Card, Flex } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { UserIconUploader } from "@/client/features/user/UserIconUploader/UserIconUploader";

type Props = { user: User };

export const UserEdit: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  const updateMutation = useMutationWithNotification(trpc.me.update, {
    succsesNotification: {
      title: "プロフィールの更新",
      message: "プロフィールを更新しました。",
    },
    errorNotification: {
      title: "プロフィールの更新",
      message: "プロフィールを更新できませんでした。",
    },
    onSuccess: () => {
      router.push(Routes.user(user.id));
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
      <PageHeader icon={IconEdit} pageName="ユーザーの編集" />
      <Box w="100%" maw={800} miw={400} m="auto">
        <Card mt="md">
          <Flex gap="md">
            <UserIconUploader user={user} />
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
