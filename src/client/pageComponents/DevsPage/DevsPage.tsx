import {
  DevCard,
  devCardMinWidthPx,
} from "@/client/features/dev/DevCard/DevCard";
import { useDevsByIdea } from "@/client/features/dev/useDevsByIdea";
import { IdeaSummaryHeader } from "@/client/features/idea/IdeaSummaryHeader/IdeaSummaryHeader";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { SvgCode } from "@/client/ui/Icons";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Idea } from "@/models/idea";
import { paginatedPageSchema } from "@/share/paging";
import { Stack } from "@mantine/core";

type Props = { idea: Idea };

export const DevsPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { devs } = useDevsByIdea({ ideaId: idea.id, page });

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={SvgCode} pageName="開発情報の一覧" />
      <Stack w="100%" miw={300} maw={1200} m="auto" gap="lg">
        <Stack gap="sm">
          <MutedText>お題</MutedText>
          <IdeaSummaryHeader idea={idea} />
        </Stack>
        <Stack gap="sm">
          <MutedText>開発情報</MutedText>
          <GridContainer minItemWidthPx={devCardMinWidthPx}>
            {devs?.list.map((dev) => {
              return <DevCard key={dev.id} dev={dev} />;
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
