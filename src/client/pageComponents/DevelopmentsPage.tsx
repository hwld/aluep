import { Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { Idea } from "../../server/models/idea";
import { paginatedPageSchema } from "../../share/schema";
import {
  DevelopmentCard,
  developmentCardMinWidthPx,
} from "../features/development/DevelopmentCard/DevelopmentCard";
import { useDevelopmentLikeOnList } from "../features/development/useDevelopmentLikeOnList";
import { useDevelopmentsPerPage } from "../features/development/useDevelopmentsPerPage";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { GridContainer } from "../ui/GridContainer";

type Props = { idea: Idea };

export const DevelopmentsPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developmentsPerPage } = useDevelopmentsPerPage(idea.id, page);
  const { colors } = useMantineTheme();
  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useDevelopmentLikeOnList(idea.id, page);

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <Stack w="100%" miw={300} maw={1200} m="auto" spacing="lg">
      <Flex align="center" gap="sm">
        <MdComputer
          size="30px"
          color={colors.red[7]}
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
        <GridContainer minItemWidthPx={developmentCardMinWidthPx}>
          {developmentsPerPage?.list.map((dev) => {
            return (
              <DevelopmentCard
                key={dev.id}
                idea={idea}
                development={dev}
                onLikeDevelopment={(developmentId) => {
                  likeDevelopmentMutation.mutate({ developmentId });
                }}
                onUnlikeDevelopment={(developmentId) => {
                  unlikeDevelopmentMutation.mutate({ developmentId });
                }}
              />
            );
          })}
        </GridContainer>
      </Stack>
      <AppPagination
        page={page}
        onChange={handleChangePage}
        total={developmentsPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
