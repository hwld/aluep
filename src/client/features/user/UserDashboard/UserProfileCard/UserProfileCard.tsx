import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { useFavoriteUserCountQuery } from "@/client/features/user/useFavoriteUserCountQuery";
import { UserFavoriteButton } from "@/client/features/user/UserDashboard/UserProfileCard/UserFavoriteButton/UserFavoriteButton";
import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { UserProfileMenuButton } from "@/client/features/user/UserDashboard/UserProfileCard/UserProfileMenuButton/UserProfileMenuButton";
import { AppLinkify } from "@/client/ui/AppLinkify/AppLinkify";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { User } from "@/models/user";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Stack, Text } from "@mantine/core";

type Props = {
  user: User;
  maxWidth?: number;
};
export const UserProfileCard: React.FC<Props> = ({ user, maxWidth }) => {
  const { session } = useSessionQuery();
  const isLoggedInUserPage = session?.user.id === user.id;

  const { favoriteUserCount } = useFavoriteUserCountQuery({ userId: user.id });

  return (
    <Card
      miw={450}
      maw={maxWidth}
      h="100%"
      pr="lg"
      pb="lg"
      pl="lg"
      pt={35}
      style={{ flexGrow: 1, position: "relative" }}
    >
      <Box style={{ position: "absolute", top: 10, right: 10 }}>
        <UserProfileMenuButton user={user} isOwner={isLoggedInUserPage} />
      </Box>
      <Stack h="100%">
        <Flex gap="md">
          <UserIcon iconSrc={user.image} size="xl" />
          <Stack miw={0} gap="xs">
            <AppTitle order={1} size={18} miw={0} truncate>
              {user.name}
            </AppTitle>
            <Flex gap="sm">
              {!isLoggedInUserPage && <UserFavoriteButton userId={user.id} />}
              <TextLink href={Routes.userFavorites(user.id)}>
                <Flex align="flex-end">
                  <Text size="md" fw="bold">
                    {favoriteUserCount ?? 0}
                    <Text
                      span
                      size="sm"
                      c="gray.5"
                      style={{ letterSpacing: "normal" }}
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
          w="100%"
          bg="gray.2"
          p="sm"
          style={{ borderRadius: "5px", overflow: "auto", flexGrow: 1 }}
        >
          {!user.profile ? (
            <Text c="gray.4">自己紹介はありません</Text>
          ) : (
            <AppLinkify>
              <Text size="sm">{user.profile}</Text>
            </AppLinkify>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
