import { Stack, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Development } from "../../server/models/development";
import { paginatedPageSchema } from "../../share/schema";
import { DevelopmentSummaryCard } from "../features/development/DevelopmentSummaryCard";
import {
  IdeaLikingUserCard,
  ideaLikingUserCardMinWidthPx,
} from "../features/user/IdeaLikingUserCard";
import { useDevelopmentLikingUsersPerPage } from "../features/user/useDevelopmentLikingUsersPerPage";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { GridContainer } from "../ui/GridContainer";
import { PageHeader } from "../ui/PageHeader";

type Props = { development: Development };
export const DevelopmentLikingUsersPage: React.FC<Props> = ({
  development,
}) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { developmentLikingUsersPerPage } = useDevelopmentLikingUsersPerPage(
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
          <GridContainer minItemWidthPx={ideaLikingUserCardMinWidthPx}>
            {developmentLikingUsersPerPage?.list.map((user) => {
              return <IdeaLikingUserCard key={user.id} likingUser={user} />;
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={developmentLikingUsersPerPage?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
