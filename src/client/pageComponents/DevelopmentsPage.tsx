import { Stack, Text, useMantineTheme } from "@mantine/core";
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
import { PageHeader } from "../ui/PageHeader";

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
    <>
      <PageHeader icon={MdComputer} pageName="開発情報の一覧" />
      <Stack w="100%" miw={300} maw={1200} m="auto" spacing="lg">
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
    </>
  );
};
