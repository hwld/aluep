import { IdeaSummaryCard } from "@/client/features/idea/IdeaSummaryCard/IdeaSummaryCard";
import {
  IdeaLikerCard,
  ideaLikerCardMinWidthPx,
} from "@/client/features/user/IdeaLikerCard/IdeaLikerCard";
import { useIdeaLikers } from "@/client/features/user/useIdeaLikers";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Idea } from "@/models/idea";
import { paginatedPageSchema } from "@/share/paging";
import { Stack, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";

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
