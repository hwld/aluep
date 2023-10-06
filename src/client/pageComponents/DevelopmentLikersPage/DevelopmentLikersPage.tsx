import { DevSummaryCard } from "@/client/features/dev/DevSummaryCard/DevSummaryCard";
import {
  IdeaLikerCard,
  ideaLikerCardMinWidthPx,
} from "@/client/features/user/IdeaLikerCard/IdeaLikerCard";
import { useDevelopmentLikers } from "@/client/features/user/useDevelopmentLikers";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Development } from "@/models/development";
import { paginatedPageSchema } from "@/share/paging";
import { Stack, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";

type Props = { development: Development };

// TODO: なんか名前が・・・
export const DevelopmentLikersPage: React.FC<Props> = ({ development }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developmentLikers } = useDevelopmentLikers({
    developmentId: development.id,
    page,
  });

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={TbHeart} pageName="開発情報をいいねしたユーザー" />
      <Stack w="100%" maw={1200} m="auto" gap="lg">
        <Stack gap="sm">
          <Text c="gray.5">いいねされた開発情報</Text>
          <DevSummaryCard development={development} />
        </Stack>

        <Stack gap="sm">
          <Text c="gray.5" ta="left">
            いいねしたユーザー
          </Text>
          <GridContainer minItemWidthPx={ideaLikerCardMinWidthPx}>
            {developmentLikers?.list.map((user) => {
              return <IdeaLikerCard key={user.id} liker={user} />;
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          value={page}
          onChange={handleChangePage}
          total={developmentLikers?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
