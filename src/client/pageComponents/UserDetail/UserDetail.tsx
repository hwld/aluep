import { UserDashboard } from "@/client/features/user/UserDashboard/UserDashboard";
import { UserDevs } from "@/client/features/user/UserDevs/UserDevs";
import { useReceivedLikeCountQuery } from "@/client/features/user/useReceivedLikeCountQuery";
import { UserLikedDevs } from "@/client/features/user/UserLikedDevs/UserLikedDevs";
import { UserLikedIdeas } from "@/client/features/user/UserLikedIdeas/UserLikedIdeas";
import { UserPostedIdeas } from "@/client/features/user/UserPostedIdeas/UserPostedIdeas";
import { useUserActivityQuery } from "@/client/features/user/useUserActivityQuery";
import { useURLParams } from "@/client/lib/useURLParams";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { TabControl } from "@/client/ui/TabControl/TabControl";
import { User, userDetailPageSchame } from "@/models/user";
import { assertNever } from "@/share/utils";
import { Box, Flex, Stack } from "@mantine/core";
import {
  IconCode,
  IconFileText,
  IconHeart,
  IconUser,
} from "@tabler/icons-react";
import { useMemo } from "react";

type Props = { user: User };

export const UserDetail: React.FC<Props> = ({ user }) => {
  const [{ tab: activeTab, page }, setURLParam] =
    useURLParams(userDetailPageSchame);

  const { recievedLikeCount } = useReceivedLikeCountQuery({ userId: user.id });
  const { userActivity } = useUserActivityQuery({ userId: user.id });

  const handleChangeTab = (tab: string) => {
    const data = userDetailPageSchame.parse({ tab, page: 1 });
    setURLParam(data);
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
      case "devs":
        return (
          <UserDevs user={user} page={page} onChangePage={handleChangePage} />
        );
      case "likedIdeas":
        return (
          <UserLikedIdeas
            user={user}
            page={page}
            onChangePage={handleChangePage}
          />
        );
      case "likedDevs":
        return (
          <UserLikedDevs
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
    <>
      <PageHeader icon={IconUser} pageName="ユーザーの詳細" />
      <Flex maw={1200} direction="column" align="center" m="auto">
        <UserDashboard
          user={user}
          receivedLikeCount={recievedLikeCount}
          userActivity={userActivity}
        />
        <Stack mt={40} w="100%" align="center" gap="xl">
          <TabControl
            activeTab={activeTab}
            onChange={handleChangeTab}
            data={[
              {
                value: "postedIdeas",
                label: "投稿したお題",
                icon: IconFileText,
              },
              {
                value: "devs",
                label: "お題の開発情報",
                icon: IconCode,
              },
              {
                value: "likedIdeas",
                label: "いいねしたお題",
                icon: IconHeart,
              },
              {
                value: "likedDevs",
                label: "いいねした開発情報",
                icon: IconHeart,
              },
            ]}
          />
          <Box w="100%">{tabContent}</Box>
        </Stack>
      </Flex>
    </>
  );
};
