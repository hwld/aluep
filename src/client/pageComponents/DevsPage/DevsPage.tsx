import {
  DevCard,
  devCardMinWidthPx,
} from "@/client/features/dev/DevCard/DevCard";
import { useDevLikeOnList } from "@/client/features/dev/useDevLikeOnList";
import { useDevsByIdea } from "@/client/features/dev/useDevsByIdea";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Idea } from "@/models/idea";
import { paginatedPageSchema } from "@/share/paging";
import { Stack, Text } from "@mantine/core";
import { MdComputer } from "react-icons/md";

type Props = { idea: Idea };

export const DevsPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { devs } = useDevsByIdea({ ideaId: idea.id, page });
  const { likeDevMutation, unlikeDevMutation } = useDevLikeOnList(
    idea.id,
    page
  );

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={MdComputer} pageName="開発情報の一覧" />
      <Stack w="100%" miw={300} maw={1200} m="auto" gap="lg">
        <Stack gap="sm">
          <Text c="gray.5">お題</Text>
          <IdeaSummaryHeader idea={idea} />
        </Stack>
        <Stack gap="sm">
          <Text c="gray.5">開発情報</Text>
          <GridContainer minItemWidthPx={devCardMinWidthPx}>
            {devs?.list.map((dev) => {
              return (
                <DevCard
                  key={dev.id}
                  idea={idea}
                  dev={dev}
                  onLikeDev={(devId) => {
                    likeDevMutation.mutate({ devId });
                  }}
                  onUnlikeDev={(devId) => {
                    unlikeDevMutation.mutate({ devId });
                  }}
                />
              );
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          value={page}
          onChange={handleChangePage}
          total={devs?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
