import { DevSummaryHeader } from "@/client/features/dev/DevSummaryHeader/DevSummaryHeader";
import {
  IdeaLikerCard,
  ideaLikerCardMinWidthPx,
} from "@/client/features/user/IdeaLikerCard/IdeaLikerCard";
import { useDevLikers } from "@/client/features/user/useDevLikers";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Dev } from "@/models/dev";
import { paginatedPageSchema } from "@/share/paging";
import { Stack } from "@mantine/core";
import { SvgHeart } from "@tabler/icons-react";

type Props = { dev: Dev };

export const DevLikersPage: React.FC<Props> = ({ dev }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { devLikers } = useDevLikers({
    devId: dev.id,
    page,
  });

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={SvgHeart} pageName="開発情報をいいねしたユーザー" />
      <Stack w="100%" maw={1200} m="auto" gap="xl">
        <Stack gap="sm">
          <MutedText>開発情報</MutedText>
          <DevSummaryHeader dev={dev} />
        </Stack>

        <Stack gap="sm">
          <MutedText>いいねしたユーザー</MutedText>
          <GridContainer minItemWidthPx={ideaLikerCardMinWidthPx}>
            {devLikers?.list.map((user) => {
              return <IdeaLikerCard key={user.id} liker={user} />;
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          value={page}
          onChange={handleChangePage}
          total={devLikers?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
