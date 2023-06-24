import { Stack, Text } from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { Idea } from "../../server/models/idea";
import { paginatedPageSchema } from "../../share/schema/util";
import {
  IdeaDevelopmentCard,
  developmentCardMinWidthPx,
} from "../features/development/IdeaDevelopmentCard/IdeaDevelopmentCard";
import { useDevelopmentLikeOnList } from "../features/development/useDevelopmentLikeOnList";
import { useDevelopmentsByIdea } from "../features/development/useDevelopmentsByIdea";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { GridContainer } from "../ui/GridContainer";
import { PageHeader } from "../ui/PageHeader";

type Props = { idea: Idea };

export const DevelopmentsPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developments } = useDevelopmentsByIdea({ ideaId: idea.id, page });
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
            {developments?.list.map((dev) => {
              return (
                <IdeaDevelopmentCard
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
          total={developments?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
