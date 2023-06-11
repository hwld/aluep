import {
  Box,
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { TbFileText, TbHeart } from "react-icons/tb";
import { User } from "../../../../server/models/user";
import { Routes } from "../../../../share/routes";
import { TextLink } from "../../../ui/TextLink";
import { LikeDevelopmentIcon } from "../../development/LikeDevelopmentIcon";
import { LikeIdeaIcon } from "../../idea/LikeIdeaIcon";
import { useRequireLoginModal } from "../../session/RequireLoginModalProvider";
import { useSessionQuery } from "../../session/useSessionQuery";
import { UserIcon } from "../UserIcon";
import { UserProfileMenuButton } from "../UserProfileMenuButton";
import { useFavoriteUser } from "../useFavoriteUser";
import { useFavoriteUserCountQuery } from "../useFavoriteUserCountQuery";
import { ReceivedLikeCount } from "../useReceivedLikeCountQuery";
import { UserActivity } from "../useUserActivityQuery";
import { UserFavoriteButton } from "./UserFavoriteButton";

type Props = {
  user: User;
  receivedLikeCount?: ReceivedLikeCount;
  userActivity?: UserActivity;
};
export const UserProfileCard: React.FC<Props> = ({
  user,
  receivedLikeCount = { ideaLikeCount: 0, developmentLikeCount: 0 },
  userActivity = {
    developmentCount: 0,
    likedIdeaCount: 0,
    postedIdeaCount: 0,
  },
}) => {
  const { colors } = useMantineTheme();
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const isLoggedInUserPage = session?.user.id === user.id;

  const { createFavoriteMutation, deleteFavoriteMutation, favorited } =
    useFavoriteUser(user.id, session?.user.id);

  const { favoriteUserCount } = useFavoriteUserCountQuery(user.id);

  const handleFavoriteUser = () => {
    if (session?.user.id === undefined) {
      openLoginModal();
      return;
    }

    if (!favorited) {
      createFavoriteMutation.mutate({ userId: user.id });
    } else {
      deleteFavoriteMutation.mutate({ userId: user.id });
    }
  };

  return (
    <Flex gap="md" w="100%" h={350}>
      <Card
        maw={700}
        h="100%"
        p="xl"
        miw={0}
        sx={{ flexGrow: 1, position: "relative" }}
      >
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <UserProfileMenuButton user={user} isOwner={isLoggedInUserPage} />
        </Box>
        <Stack mt="md">
          <Flex gap="md">
            <UserIcon iconSrc={user.image} size="xl" />
            <Stack miw={0} spacing="xs">
              <Title
                order={1}
                size={18}
                miw={0}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </Title>
              <Flex gap="sm">
                {!isLoggedInUserPage && (
                  <UserFavoriteButton
                    onFavorite={handleFavoriteUser}
                    favorited={favorited}
                    userName={user.name}
                  />
                )}
                <TextLink href={Routes.userFavorites(user.id)}>
                  <Flex align="flex-end">
                    <Text size="md" fw="bold" sx={{ letterSpacing: "0.3rem" }}>
                      {favoriteUserCount ?? 0}
                      <Text
                        span
                        size="sm"
                        c="gray.5"
                        sx={{ letterSpacing: "normal" }}
                      >
                        favorites
                      </Text>
                    </Text>
                  </Flex>
                </TextLink>
              </Flex>
            </Stack>
          </Flex>
          <Box
            h={160}
            w="100%"
            bg="gray.2"
            p="sm"
            sx={{ borderRadius: "5px", overflow: "auto" }}
          >
            {!user.profile ? (
              <Text c="gray.4">自己紹介はありません</Text>
            ) : (
              <Text size="sm">{user.profile}</Text>
            )}
          </Box>
        </Stack>
      </Card>

      <Card w="250px" h="100%" px="xl" sx={{ flexShrink: 0 }}>
        <Text c="gray.5" fw="bold">
          貰ったいいね
        </Text>
        <Stack sx={{ flexShrink: 0 }} spacing="lg" mt="md">
          <Stack spacing={5}>
            <Text size="sm" c="gray.5">
              投稿者としてのいいね
            </Text>
            <Flex align="center" gap={10}>
              <LikeIdeaIcon size="lg" />
              <Flex align="flex-end" gap={2}>
                <Text size="xl" fw="bold" c="red.7">
                  {receivedLikeCount.ideaLikeCount}
                </Text>
                <Text size="sm">likes</Text>
              </Flex>
            </Flex>
          </Stack>
          <Stack spacing={5}>
            <Text size="sm" c="gray.5">
              開発者としてのいいね
            </Text>
            <Flex align="center" gap={10}>
              <LikeDevelopmentIcon size="lg" />
              <Flex align="flex-end" gap={2}>
                <Text size="xl" fw="bold" c="red.7">
                  {receivedLikeCount.developmentLikeCount}
                </Text>
                <Text size="sm">likes</Text>
              </Flex>
            </Flex>
          </Stack>
        </Stack>
      </Card>

      <Card w={250} h="100%" px="xl" sx={{ flexShrink: 0 }}>
        <Text c="gray.5" fw="bold">
          アクティビティ
        </Text>
        <Stack mt="md">
          <Stack spacing={5}>
            <Text size="sm" c="gray.5">
              投稿したお題の数
            </Text>
            <Flex align="center" gap={10}>
              <TbFileText size={40} color={colors.red[7]} />
              <Flex align="flex-end" gap={2}>
                <Text size="md" fw="bold" c="red.7">
                  {userActivity.postedIdeaCount}
                </Text>
                <Text size="xs">件</Text>
              </Flex>
            </Flex>
            <Divider color="red" size={3} />
          </Stack>
          <Stack spacing={5}>
            <Text size="sm" c="gray.5">
              開発したお題の数
            </Text>
            <Flex align="center" gap={10}>
              <MdComputer size={40} color={colors.blue[7]} />
              <Flex align="flex-end" gap={2}>
                <Text size="md" fw="bold" c="blue.7">
                  {userActivity.developmentCount}
                </Text>
                <Text size="xs">件</Text>
              </Flex>
            </Flex>
            <Divider color="blue" size={3} />
          </Stack>
          <Stack spacing={5}>
            <Text size="sm" c="gray.5">
              いいねしたお題の数
            </Text>
            <Flex align="center" gap={10}>
              <TbHeart size={40} color={colors.pink[6]} />
              <Flex align="flex-end" gap={2}>
                <Text size="md" fw="bold" c="pink.6">
                  {userActivity.likedIdeaCount}
                </Text>
                <Text size="xs">件</Text>
              </Flex>
            </Flex>
            <Divider color="pink" size={3} />
          </Stack>
        </Stack>
      </Card>
    </Flex>
  );
};
