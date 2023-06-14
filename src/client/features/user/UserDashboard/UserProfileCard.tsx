import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { User } from "../../../../server/models/user";
import { Routes } from "../../../../share/routes";
import { TextLink } from "../../../ui/TextLink";
import { useRequireLoginModal } from "../../session/RequireLoginModalProvider";
import { useSessionQuery } from "../../session/useSessionQuery";
import { UserIcon } from "../UserIcon";
import { UserProfileMenuButton } from "../UserProfileMenuButton";
import { useFavoriteUser } from "../useFavoriteUser";
import { useFavoriteUserCountQuery } from "../useFavoriteUserCountQuery";
import { UserFavoriteButton } from "./UserFavoriteButton";

type Props = {
  user: User;
  maxWidth?: number;
};
export const UserProfileCard: React.FC<Props> = ({ user, maxWidth }) => {
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
    <Card
      miw={450}
      maw={maxWidth}
      h="100%"
      p="xl"
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
                  <Text size="md" fw="bold">
                    {favoriteUserCount ?? 0}
                    <Text
                      span
                      size="sm"
                      c="gray.5"
                      sx={{ letterSpacing: "normal" }}
                    >
                      {" favorites"}
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
  );
};
