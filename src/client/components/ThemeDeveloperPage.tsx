import { Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { MdComputer } from "react-icons/md";
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
  const mantineTheme = useMantineTheme();

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
          </Stack>
        </Stack>
        <AppPagination
          page={page}
          onChange={setPage}
          total={data?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
