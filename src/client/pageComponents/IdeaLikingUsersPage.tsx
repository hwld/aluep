import { Stack, Text, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Idea } from "../../server/models/idea";
import { paginatedPageSchema } from "../../share/schema";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import {
  IdeaLikingUserCard,
  ideaLikingUserCardMinWidthPx,
} from "../features/user/IdeaLikingUserCard";
import { useIdeaLikingUsersPerPage } from "../features/user/useIdeaLikingUsersQuery";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { GridContainer } from "../ui/GridContainer";
import { PageHeader } from "../ui/PageHeader";

type Props = { idea: Idea };
export const IdeaLikingUsersPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { ideaLikingUsersPerPage } = useIdeaLikingUsersPerPage(idea.id, page);
  const mantineTheme = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={TbHeart} pageName="お題をいいねしたユーザー" />
      <Stack w="100%" maw={1200} m="auto" spacing="lg">
        <Stack spacing="sm">
          <Text c="gray.5">いいねされたお題</Text>
          <IdeaSummaryCard idea={idea} />
        </Stack>

        <Stack spacing="sm">
          <Text c="gray.5" align="left">
            いいねしたユーザー
          </Text>
          <GridContainer minItemWidthPx={ideaLikingUserCardMinWidthPx}>
            {ideaLikingUsersPerPage?.list.map((user) => {
              return <IdeaLikingUserCard key={user.id} likingUser={user} />;
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={ideaLikingUsersPerPage?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
