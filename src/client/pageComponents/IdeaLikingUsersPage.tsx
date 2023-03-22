import { Box, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Idea } from "../../server/models/idea";
import { paginatedPageSchema } from "../../share/schema";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import {
  LikingUserCard,
  likingUserCardMinWidthPx,
} from "../features/user/LikingUserCard";
import { NothingIdeaLikingUsers } from "../features/user/NothingIdeaLikingUsers";
import { useIdeaLikingUsersPerPage } from "../features/user/useIdeaLikingUsersQuery";
import { userCardMinWidthPx } from "../features/user/UserCard";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";

type Props = { idea: Idea };
export const IdeaLikingUsersPage: React.FC<Props> = ({ idea }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { ideaLikingUsersPerPage } = useIdeaLikingUsersPerPage(idea.id, page);
  const mantineTheme = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <Stack w="100%" miw={userCardMinWidthPx} maw={800} m="auto" spacing="lg">
      <Flex align="center" gap="sm">
        <TbHeart
          size="35px"
          color="transparent"
          fill={mantineTheme.colors.red[7]}
        />
        <Title order={3}>お題のいいね</Title>
      </Flex>
      <Stack spacing="sm">
        <Text c="gray.5">いいねされたお題</Text>
        <IdeaSummaryCard idea={idea} />
      </Stack>
      {idea.likes === 0 ? (
        <NothingIdeaLikingUsers />
      ) : (
        <Stack spacing="sm">
          <Text c="gray.5" align="left">
            いいねしたユーザー
          </Text>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${likingUserCardMinWidthPx}px, 1fr))`,
              gap: theme.spacing.xs,
            })}
          >
            {ideaLikingUsersPerPage?.list.map((user) => {
              return (
                <LikingUserCard
                  key={user.id}
                  user={user}
                  ideaLike={{
                    id: "",
                    ideaId: "",
                    userId: "",
                    createdAt: user.ideaLikeCreated,
                  }}
                />
              );
            })}
          </Box>
        </Stack>
      )}
      <AppPagination
        page={page}
        onChange={handleChangePage}
        total={ideaLikingUsersPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
