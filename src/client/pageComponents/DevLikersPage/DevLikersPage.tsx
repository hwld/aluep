import { DevSummaryHeader } from "@/client/features/dev/DevSummaryHeader/DevSummaryHeader";
import {
  IdeaLikerCard,
  ideaLikerCardMinWidthPx,
} from "@/client/features/user/IdeaLikerCard/IdeaLikerCard";
import { useDevLikers } from "@/client/features/user/useDevLikers";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Dev } from "@/models/dev";
import { paginatedPageSchema } from "@/share/paging";
import { Stack, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";

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
      <PageHeader icon={TbHeart} pageName="開発情報をいいねしたユーザー" />
      {/* // TODO */}
      <Stack w="100%" maw={1200} m="auto" gap="xl">
        <Stack gap="sm">
          <Text c="gray.5">開発情報</Text>
          <DevSummaryHeader dev={dev} />
        </Stack>

        <Stack gap="sm">
          <Text c="gray.5" ta="left">
            いいねしたユーザー
          </Text>
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
