import { Box, Button, Flex, Stack } from "@mantine/core";
import { useMemo } from "react";
import { User } from "../../server/models/user";
import { UserDetailPageTab, userDetailPageSchame } from "../../share/schema";
import { assertNever } from "../../share/utils";
import { UserDetailTab } from "../features/user/UserDetailTab";
import { UserDevelopments } from "../features/user/UserDevelopments";
import { UserLikedIdeas } from "../features/user/UserLikedIdeas";
import { UserPostedIdeas } from "../features/user/UserPostedIdeas";
import { UserProfileCard } from "../features/user/UserProfileCard/UserProfileCard";
import { useReceivedLikeCountQuery } from "../features/user/useReceivedLikeCountQuery";
import { useUserActivityQuery } from "../features/user/useUserActivityQuery";
import { useURLParams } from "../lib/useURLParams";

type Props = { user: User };

export const UserDetailPage: React.FC<Props> = ({ user }) => {
  const [{ tab: activeTab, page }, setURLParam] =
    useURLParams(userDetailPageSchame);

  const { recievedLikeCount } = useReceivedLikeCountQuery(user.id);
  const { userActivity } = useUserActivityQuery(user.id);

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
      case "developments":
        return (
          <UserDevelopments
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
      <UserProfileCard
        user={user}
        receivedLikeCount={recievedLikeCount}
        userActivity={userActivity}
      />
      <Stack mt={40} w="100%" align="flex-start" spacing="xl">
        <Button.Group>
          <UserDetailTab
            tab="postedIdeas"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            投稿したお題
          </UserDetailTab>
          <UserDetailTab
            tab="developments"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            お題の開発情報
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
