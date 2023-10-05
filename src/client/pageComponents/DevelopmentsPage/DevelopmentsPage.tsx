import {
  DevCard,
  developmentCardMinWidthPx,
} from "@/client/features/dev/DevCard/DevCard";
import { useDevLikeOnList } from "@/client/features/dev/useDevLikeOnList";
import { useDevsByIdea } from "@/client/features/dev/useDevsByIdea";
import { IdeaSummaryCard } from "@/client/features/idea/IdeaSummaryCard";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Idea } from "@/models/idea";
import { paginatedPageSchema } from "@/share/paging";
import { Stack, Text } from "@mantine/core";
import { MdComputer } from "react-icons/md";

type Props = { idea: Idea };

export const DevelopmentsPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developments } = useDevsByIdea({ ideaId: idea.id, page });
  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useDevLikeOnList(idea.id, page);

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
                <DevCard
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
