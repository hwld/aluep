import { Stack, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Development } from "../../server/models/development";
import { paginatedPageSchema } from "../../share/schema";
import { DevelopmentSummaryCard } from "../features/development/DevelopmentSummaryCard";
import {
  IdeaLikerCard,
  ideaLikerCardMinWidthPx,
} from "../features/user/IdeaLikerCard";
import { useDevelopmentLikersPerPage } from "../features/user/useDevelopmentLikersPerPage";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { GridContainer } from "../ui/GridContainer";
import { PageHeader } from "../ui/PageHeader";

type Props = { development: Development };
export const DevelopmentLikersPage: React.FC<Props> = ({ development }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developmentLikersPerPage } = useDevelopmentLikersPerPage(
    development.id,
    page
  );

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={TbHeart} pageName="開発情報をいいねしたユーザー" />
      <Stack w="100%" maw={1200} m="auto" spacing="lg">
        <Stack spacing="sm">
          <Text c="gray.5">いいねされた開発情報</Text>
          <DevelopmentSummaryCard development={development} />
        </Stack>

        <Stack spacing="sm">
          <Text c="gray.5" align="left">
            いいねしたユーザー
          </Text>
          <GridContainer minItemWidthPx={ideaLikerCardMinWidthPx}>
            {developmentLikersPerPage?.list.map((user) => {
              return <IdeaLikerCard key={user.id} liker={user} />;
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={developmentLikersPerPage?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
