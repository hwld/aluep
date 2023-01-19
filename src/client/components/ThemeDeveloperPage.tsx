import { Box, Flex, Stack, Title } from "@mantine/core";
import { Theme } from "../../server/models/theme";
import { usePaginatedDeveloperQuery } from "../hooks/usePaginatedDeveloperQueery";
import { usePaginationState } from "../hooks/usePaginationState";
import { useThemeDevelopersQuery } from "../hooks/useThemeDevelopersQuery";
import { AppPagination } from "./AppPagination";
import { ThemeDeveloperCard } from "./DeveloperCard/ThemeDeveloperCard";
import { ThemeSummaryCard } from "./ThemeSummaryCard";
type Props = { theme: Theme };

export const ThemeDeveloperPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const { data } = usePaginatedDeveloperQuery(theme.id, page);
  const { likeDeveloperMutation } = useThemeDevelopersQuery(theme.id);
  return (
    <>
      <Flex maw={800} direction="column" align="center" m="auto">
        <Stack mt="xl" w="100%" spacing="xs">
          <Title order={4}>参加しているお題</Title>
          <ThemeSummaryCard theme={theme} />
          <Title align="left" order={4}>
            参加している開発者
          </Title>
          <Box
            sx={(theme) => ({
              display: "grid",
              gap: theme.spacing.md,
            })}
          >
            {data?.developers.map((developer) => {
              return (
                <ThemeDeveloperCard
                  key={developer.id}
                  theme={theme}
                  developer={developer}
                  onLikeDeveloper={(developerId, like) => {
                    likeDeveloperMutation.mutate({ developerId, like });
                  }}
                />
              );
            })}
          </Box>
          <AppPagination
            page={page}
            onChange={setPage}
            total={data?.allPages ?? 0}
          />
        </Stack>
      </Flex>
    </>
  );
};
