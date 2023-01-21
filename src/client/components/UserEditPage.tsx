import { Box, Card, Flex, Title, useMantineTheme } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { RiEdit2Line } from "react-icons/ri";
import { RouterInputs } from "../../server/trpc";
import { ProfileFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { UserProfileForm } from "./UserProfileForm";

type Props = { user: Session["user"] };
export const UserEditPage: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

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
    <Box w={800} m="auto">
      <Flex align="center" gap="xs">
        <RiEdit2Line size="30px" color={mantineTheme.colors.red[7]} />
        <Title order={3}>プロフィールの更新</Title>
      </Flex>
      <Card mt="md">
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
      </Card>
    </Box>
  );
};
