import { Box, Button, Card, Flex, Stack, Text } from "@mantine/core";
import { User } from "@prisma/client";
import { useMemo } from "react";
import { UserDetailPageTab, userDetailSchame } from "../../share/schema";
import { assertNever } from "../../share/utils";
import { useThemeDeveloperLikesQuery } from "../features/developer/useThemeDeveloperLikesQuery";
import { useSumThemeLikesQuery } from "../features/theme/useSumThemeLikesQuery";
import { UserDetailTab } from "../features/user/UserDetail/UserDetailTab";
import { UserJoinedThemes } from "../features/user/UserDetail/UserJoinedThemes";
import { UserLikedThemes } from "../features/user/UserDetail/UserLikedThemes";
import { UserPostedThemes } from "../features/user/UserDetail/UserPostedThemes";
import { UserDetailCard } from "../features/user/UserDetailCard";
import { useURLParams } from "../lib/useURLParams";

type Props = { user: User };

// TODO: べたがきをどうにかする
// TODO: レイアウトを見直す
export const UserDetailPage: React.FC<Props> = ({ user }) => {
  const [{ tab: activeTab, page }, setURLParam] =
    useURLParams(userDetailSchame);
  const { sumThemeLikes } = useSumThemeLikesQuery(user.id);
  const { themeDeveloperLikes } = useThemeDeveloperLikesQuery(user.id);

  const handleChangeTab = (tab: UserDetailPageTab) => {
    setURLParam({ tab, page: 1 });
  };

  const tabContent = useMemo(() => {
    const handleChangePage = (page: number) => {
      setURLParam({ page });
    };

    switch (activeTab) {
      case "postedThemes":
        return (
          <UserPostedThemes
            user={user}
            page={page}
            onChangePage={handleChangePage}
          />
        );
      case "joinedThemes":
        return (
          <UserJoinedThemes
            user={user}
            page={page}
            onChangePage={handleChangePage}
          />
        );
      case "likedThemes":
        return (
          <UserLikedThemes
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
          userImage={user.image}
          userName={user.name}
          sumThemeLikes={sumThemeLikes ?? 0}
          themeDeveloperLikes={themeDeveloperLikes ?? 0}
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
            tab="postedThemes"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            投稿したお題
          </UserDetailTab>
          <UserDetailTab
            tab="joinedThemes"
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
          >
            開発したお題
          </UserDetailTab>
          <UserDetailTab
            tab="likedThemes"
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
