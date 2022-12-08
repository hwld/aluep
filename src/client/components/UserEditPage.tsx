import { Box, Card, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { RouterInputs } from "../../server/trpc";
import { ProfileFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { UserProfileForm } from "./UserProfileForm";

type Props = { user: Session["user"] };
export const UserEditPage: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["me"]["update"]) => {
      return trpc.me.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新しました。",
        color: "green",
      });
      router.back();
    },
    onError: () => {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新できませんでした。",
        color: "red",
      });
    },
  });

  const handleUpdateUser = ({ name, profile }: ProfileFormData) => {
    updateMutation.mutate({ name, profile });
  };

  const handleCancel = () => {
    router.back();
  };
  console.log(user.name);
  console.log(user);
  return (
    <Box w={800} m="auto">
      <Title>プロフィールの更新</Title>
      <Card mt="xl">
        <UserProfileForm
          actoinText="更新する"
          onSubmit={handleUpdateUser}
          onCancel={handleCancel}
          defaultValues={{
            name: user.name ?? "",
            profile: user.profile ?? "",
          }}
        />
      </Card>
    </Box>
  );
};
