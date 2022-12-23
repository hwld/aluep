import { Avatar, Box, Card, Flex, Text, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { RouterInputs } from "../../server/trpc";
import { ThemeJoinFormData } from "../../share/schema";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { ThemeJoinForm } from "./ThemeJoinForm";
import { ThemeTagBadge } from "./ThemeTagBadge";

type Props = { theme: Theme; developer: ThemeDeveloper };
export const DeveloperEditPage: React.FC<Props> = ({ theme, developer }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["themeDeveloper"]["update"]) => {
      return trpc.themeDeveloper.update.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "参加情報の更新",
        message: "参加情報を更新しました。",
      });
      queryClient.invalidateQueries(["developers", developer.id]);
      router.push(`/themes/${theme.id}`);
    },
    onError: () => {
      showErrorNotification({
        title: "参加情報の更新",
        message: "参加情報を更新できませんでした。",
      });
    },
  });

  const handleUpdateDeveloper = (data: ThemeJoinFormData) => {
    updateMutation.mutate(data);
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <Box w={800} m="auto">
      <Title order={3}>お題の参加情報の更新</Title>
      <Card mt="md">
        <Title order={4}>{theme?.title}</Title>
        <Flex mt="md" gap={5}>
          <Avatar
            src={theme?.user.image}
            size="md"
            radius={100}
            sx={(theme) => ({
              borderWidth: "2px",
              borderColor: theme.colors.gray[2],
              borderStyle: "solid",
              borderRadius: "100%",
            })}
          />
          <Text size="sm">{theme?.user.name}</Text>
        </Flex>
        <Flex gap={10} mt="sm" wrap="wrap">
          {theme?.tags.map((tag) => {
            return <ThemeTagBadge key={tag.id}>{tag.name}</ThemeTagBadge>;
          })}
        </Flex>
      </Card>
      <Card mt="xl">
        <ThemeJoinForm
          onSubmit={handleUpdateDeveloper}
          onCancel={handleBack}
          themeId={theme.id}
          defaultValues={developer}
          submitText="更新する"
          isSubmitting={updateMutation.isLoading}
        />
      </Card>
    </Box>
  );
};
