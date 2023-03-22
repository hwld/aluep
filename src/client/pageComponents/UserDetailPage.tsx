import { Box, Button, Card, Flex, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { User } from "../../server/models/user";
import { userDetailPageSchame, UserDetailPageTab } from "../../share/schema";
import { assertNever } from "../../share/utils";
import { useDevelopmentLikesQuery } from "../features/development/useDevelopmentLikesQuery";
import { useSumIdeaLikesQuery } from "../features/idea/useSumIdeaLikesQuery";
import { UserDetailTab } from "../features/user/UserDetail/UserDetailTab";
import { UserDevelopedIdeas } from "../features/user/UserDetail/UserDevelopedIdeas";
import { UserLikedIdeas } from "../features/user/UserDetail/UserLikedIdeas";
import { UserPostedIdeas } from "../features/user/UserDetail/UserPostedIdeas";
import { UserDetailCard } from "../features/user/UserDetailCard";
import { useURLParams } from "../lib/useURLParams";

type Props = { user: User };

export const UserDetailPage: React.FC<Props> = ({ user }) => {
  const [{ tab: activeTab, page }, setURLParam] =
    useURLParams(userDetailPageSchame);
  const { sumIdeaLikes } = useSumIdeaLikesQuery(user.id);
  const { developmentLikes: developmentLikes } = useDevelopmentLikesQuery(
    user.id
  );

  const handleChangeTab = (tab: UserDetailPageTab) => {
    setURLParam({ tab, page: 1 });
  };

  const tabContent = useMemo(() => {
    const handleChangePage = (page: number) => {
      setURLParam({ page });
    };

    switch (activeTab) {
      case "postedIdeas":
        return (
          <UserPostedIdeas
            user={user}
            page={page}
            onChangePage={handleChangePage}
          />
        );
      case "developedIdeas":
        return (
          <UserDevelopedIdeas
            user={user}
            page={page}
            onChangePage={handleChangePage}
          />
        );
      case "likedIdeas":
        return (
          <UserLikedIdeas
            user={user}
            page={page}
            onChangePage={handleChangePage}
          />
        );
      default:
        assertNever(activeTab);
    }
  }, [activeTab, page, setURLParam, user]);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex w="100%" mih={300} gap="md" mt={60}>
        <UserDetailCard
          sumIdeaLikes={sumIdeaLikes ?? 0}
          developmentLikes={developmentLikes ?? 0}
          user={user}
        />
        <Card mih={20} sx={{ flexGrow: 1 }}>
          <Card.Section withBorder inheritPadding py="md">
            <Text c="gray.5">自己紹介</Text>
          </Card.Section>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Text
              mah={200}
              sx={() => {
                return { overflow: "auto" };
              }}
            >
              {user.profile}
            </Text>
          </Card.Section>
        </Card>
      </Flex>
      <Stack mt={30} w="100%" align="center" spacing="xl">
        <Button.Group>
          <UserDetailTab
            tab="postedIdeas"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            投稿したお題
          </UserDetailTab>
          <UserDetailTab
            tab="developedIdeas"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            開発したお題
          </UserDetailTab>
          <UserDetailTab
            tab="likedIdeas"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            いいねしたお題
          </UserDetailTab>
        </Button.Group>
        <Box w="100%">{tabContent}</Box>
      </Stack>
    </Flex>
  );
};
