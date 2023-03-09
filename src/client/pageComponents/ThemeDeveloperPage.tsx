import { Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { paginatedPageSchema } from "../../share/schema";
import { DeveloperCard } from "../features/developer/DeveloperCard/DeveloperCard";
import { useDevelopersPerPage } from "../features/developer/useDevelopersPerPage";
import { ThemeSummaryCard } from "../features/theme/ThemeSummaryCard";
import { useLikeThemeDeveloper } from "../features/theme/useLikeThemeDeveloper";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
type Props = { theme: Theme };

export const ThemeDeveloperPage: React.FC<Props> = ({ theme }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developersPerPage } = useDevelopersPerPage(theme.id, page);
  const { likeDeveloperMutation } = useLikeThemeDeveloper(theme.id, page);
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
          <Title order={3}>お題の開発者</Title>
        </Flex>
        <Stack spacing="sm">
          <Text c="gray.5">開発されているお題</Text>
          <ThemeSummaryCard theme={theme} />
        </Stack>
        <Stack spacing="sm">
          <Text c="gray.5">開発者</Text>
          <Stack spacing="xs">
            {developersPerPage?.list.map((developer) => {
              return (
                <DeveloperCard
                  key={developer.id}
                  theme={theme}
                  developer={developer}
                  onLikeDeveloper={(developerId, like) => {
                    likeDeveloperMutation.mutate({ developerId, like });
                  }}
                />
              );
            })}
          </Stack>
        </Stack>
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={developersPerPage?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
