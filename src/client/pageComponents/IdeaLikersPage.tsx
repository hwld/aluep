import { Stack, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Idea } from "../../server/models/idea";
import { paginatedPageSchema } from "../../share/schema/util";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import {
  IdeaLikerCard,
  ideaLikerCardMinWidthPx,
} from "../features/user/IdeaLikerCard";
import { useIdeaLikers } from "../features/user/useIdeaLikers";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { GridContainer } from "../ui/GridContainer";
import { PageHeader } from "../ui/PageHeader";

type Props = { idea: Idea };
export const IdeaLikersPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { ideaLikers } = useIdeaLikers({ ideaId: idea.id, page });

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
          <GridContainer minItemWidthPx={ideaLikerCardMinWidthPx}>
            {ideaLikers?.list.map((user) => {
              return <IdeaLikerCard key={user.id} liker={user} />;
            })}
          </GridContainer>
        </Stack>
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={ideaLikers?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
