import { Card, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { MdComputer } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { ThemeDevelopment } from "../../server/models/themeDevelopment";
import { CreateRepositoryData, ThemeDevelopFormData } from "../../share/schema";
import { ThemeDevelopForm } from "../features/theme/ThemeDevelopForm";
import { ThemeSummaryCard } from "../features/theme/ThemeSummaryCard";
import { useThemeDevelop } from "../features/theme/useThemeDevelop";

type Props = {
  theme: Theme;
  development: ThemeDevelopment;
  restoredValues: CreateRepositoryData;
};
export const DevelopmentEditPage: React.FC<Props> = ({
  theme,
  development,
  restoredValues,
}) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const {
    mutations: { updateDevelopmentMutation },
  } = useThemeDevelop(theme.id);

  const handleUpdateDevelopment = (data: ThemeDevelopFormData) => {
    updateDevelopmentMutation.mutate({
      ...data,
      developmentId: development.id,
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Stack w="100%" maw={800} miw={300} m="auto" spacing="lg">
      <Flex align="center" gap="xs">
        <MdComputer
          size="30px"
          color={mantineTheme.colors.red[7]}
          style={{ marginTop: "3px" }}
        />
        <Title order={3}>お題開発情報の更新</Title>
      </Flex>
      <Stack spacing="xs">
        <Text c="gray.5">開発しているお題</Text>
        <ThemeSummaryCard theme={theme} />
      </Stack>
      <Stack spacing="xs">
        <Text c="gray.5">開発情報</Text>
        <Card>
          <ThemeDevelopForm
            onSubmit={handleUpdateDevelopment}
            onCancel={handleBack}
            themeId={theme.id}
            isRelogined={Object.keys(restoredValues).length > 0}
            defaultValues={{
              comment: restoredValues.developmentComment ?? development.comment,
              // 復元されたフィールドが1つ以上あれば、リポジトリの作成を選択していたと解釈する。
              ...(Object.keys(restoredValues).length > 0
                ? {
                    type: "createRepository",
                    githubRepositoryName: restoredValues.repositoryName ?? "",
                    githubRepositoryDescription:
                      restoredValues.repositoryDesc ?? "",
                  }
                : {
                    type: "referenceRepository",
                    githubRepositoryUrl: development.githubUrl,
                  }),
            }}
            submitText="更新する"
            isLoading={
              updateDevelopmentMutation.isLoading ||
              updateDevelopmentMutation.isSuccess
            }
          />
        </Card>
      </Stack>
    </Stack>
  );
};
