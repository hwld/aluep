import { Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { paginatedPageSchema } from "../../share/schema";
import { DevelopmentCard } from "../features/development/DevelopmentCard/DevelopmentCard";
import { useDevelopmentsPerPage } from "../features/development/useDevelopmentsPerPage";
import { ThemeSummaryCard } from "../features/theme/ThemeSummaryCard";
import { useThemeDevelopmentLike } from "../features/theme/useThemeDevelopmentLike";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
type Props = { theme: Theme };

export const ThemeDevelopmentPage: React.FC<Props> = ({ theme }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developmentsPerPage } = useDevelopmentsPerPage(theme.id, page);
  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useThemeDevelopmentLike(theme.id, page);
  const mantineTheme = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <Stack w="100%" miw={300} maw={800} m="auto" spacing="lg">
        <Flex align="center" gap="sm">
          <MdComputer
            size="30px"
            color={mantineTheme.colors.red[7]}
            style={{ marginTop: "3px" }}
          />
          <Title order={3}>お題の開発情報</Title>
        </Flex>
        <Stack spacing="sm">
          <Text c="gray.5">開発されているお題</Text>
          <ThemeSummaryCard theme={theme} />
        </Stack>
        <Stack spacing="sm">
          <Text c="gray.5">開発情報</Text>
          <Stack spacing="xs">
            {developmentsPerPage?.list.map((development) => {
              return (
                <DevelopmentCard
                  key={development.id}
                  theme={theme}
                  development={development}
                  onLikeDevelopment={(developmentId) => {
                    likeDevelopmentMutation.mutate({ developmentId });
                  }}
                  onUnlikeDevelopment={(developmentId) => {
                    unlikeDevelopmentMutation.mutate({ developmentId });
                  }}
                />
              );
            })}
          </Stack>
        </Stack>
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={developmentsPerPage?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
