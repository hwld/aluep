import { Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { Idea } from "../../server/models/idea";
import { paginatedPageSchema } from "../../share/schema";
import { DevelopmentCard } from "../features/development/DevelopmentCard/DevelopmentCard";
import { useDevelopmentsPerPage } from "../features/development/useDevelopmentsPerPage";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import { useDevelopmentLike } from "../features/idea/useDevelopmentLike";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
type Props = { idea: Idea };

export const DevelopmentPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developmentsPerPage } = useDevelopmentsPerPage(idea.id, page);
  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useDevelopmentLike(idea.id, page);
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
          <IdeaSummaryCard idea={idea} />
        </Stack>
        <Stack spacing="sm">
          <Text c="gray.5">開発情報</Text>
          <Stack spacing="xs">
            {developmentsPerPage?.list.map((development) => {
              return (
                <DevelopmentCard
                  key={development.id}
                  idea={idea}
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
