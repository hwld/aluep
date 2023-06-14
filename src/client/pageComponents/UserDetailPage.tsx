import { Box, Flex, Stack } from "@mantine/core";
import { useMemo } from "react";
import { TbCode, TbFileText, TbHeart } from "react-icons/tb";
import { User } from "../../server/models/user";
import { UserDetailPageTab, userDetailPageSchame } from "../../share/schema";
import { assertNever } from "../../share/utils";
import { UserDashboard } from "../features/user/UserDashboard/UserDashboard";
import { UserDevelopments } from "../features/user/UserDevelopments";
import { UserLikedDevelopments } from "../features/user/UserLikedDevelopments";
import { UserLikedIdeas } from "../features/user/UserLikedIdeas";
import { UserPostedIdeas } from "../features/user/UserPostedIdeas";
import { useReceivedLikeCountQuery } from "../features/user/useReceivedLikeCountQuery";
import { useUserActivityQuery } from "../features/user/useUserActivityQuery";
import { useURLParams } from "../lib/useURLParams";
import { TabControl } from "../ui/TabControl";

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
      case "likedDevelopments":
        return (
          <UserLikedDevelopments
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
      <UserDashboard
        user={user}
        receivedLikeCount={recievedLikeCount}
        userActivity={userActivity}
      />
      <Stack mt={40} w="100%" align="center" spacing="xl">
        <TabControl
          activeTab={activeTab}
          onChange={handleChangeTab}
          data={[
            {
              value: "postedIdeas",
              label: "投稿したお題",
              icon: TbFileText,
            },
            {
              value: "developments",
              label: "お題の開発情報",
              icon: TbCode,
            },
            {
              value: "likedIdeas",
              label: "いいねしたお題",
              icon: TbHeart,
            },
            {
              value: "likedDevelopments",
              label: "いいねした開発情報",
              icon: TbHeart,
            },
          ]}
        />
        <Box w="100%">{tabContent}</Box>
      </Stack>
    </Flex>
  );
};
