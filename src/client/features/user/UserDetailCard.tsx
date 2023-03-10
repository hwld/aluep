import { Box, Button, Card, Flex, Text, Tooltip } from "@mantine/core";
import { User } from "@prisma/client";
import Link from "next/link";

import router from "next/router";
import { RiEdit2Line } from "react-icons/ri";
import { Routes } from "../../../share/routes";
import { CardActionIcon } from "../../ui/CardActionIcon";

import { LikeDeveloperIcon } from "../developer/LikeDeveloperIcon";
import { useRequireLoginModal } from "../session/RequireLoginModalProvider";
import { useSessionQuery } from "../session/useSessionQuery";
import { LikeThemeIcon } from "../theme/LikeThemeIcon";
import { useFavoriteUser } from "./useFavoriteUser";
import { useFavoriteUsersCountQuery } from "./useFavoriteUsersCountQuery";
import { UserFavoriteButton } from "./UserDetail/UserFavoriteButton";
import { UserDetailMenuButton } from "./UserDetailMenuButton";
import { UserIcon } from "./UserIcon";

type Props = {
  sumThemeLikes?: number;
  themeDeveloperLikes?: number;
  user: User;
};
export function UserDetailCard({
  sumThemeLikes,
  themeDeveloperLikes,
  user,
}: Props) {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  //現在見ている自分のページか
  const isLogedInUserPage = session?.user.id === user.id;

  const { createFavoriteMutation, deleteFavoriteMutation, favorited } =
    useFavoriteUser(user.id, session?.user.id);

  const { favoriteUsersCount } = useFavoriteUsersCountQuery(user.id);

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

  const handleFavoriteLiet = () => {
    router.push(Routes.userFavorites(user.id));
  };

  return (
    <Card h={300} w={250} sx={{ flexShrink: 0 }}>
      <Flex
        direction="column"
        justify="space-between"
        h="100%"
        style={{ position: "relative" }}
      >
        <Box style={{ position: "absolute" }}>
          <UserDetailMenuButton user={user} />
        </Box>

        {isLogedInUserPage && (
          <Link href={Routes.userUpdate} passHref>
            <CardActionIcon style={{ position: "absolute", right: 0, top: 0 }}>
              <RiEdit2Line size={20} />
            </CardActionIcon>
          </Link>
        )}
        <Flex align="center" gap={20} wrap="wrap" direction="column">
          <UserIcon iconSrc={user.image} size="xl" />
        </Flex>
        <Flex align="center" justify="center">
          <Text>{user.name}</Text>
        </Flex>

        <Flex justify="center">
          {!isLogedInUserPage && (
            <UserFavoriteButton
              onFavorite={handleFavoriteUser}
              favorited={favorited}
              userName={user.name}
            />
          )}
          <Button
            leftIcon={favoriteUsersCount === 0 ? "0" : favoriteUsersCount}
            variant="subtle"
            compact
            onClick={handleFavoriteLiet}
          >
            favorite
          </Button>
        </Flex>

        <Flex gap={40} mt={10} wrap="wrap" justify="center">
          <Box>
            <Tooltip
              label="投稿したお題のいいねの合計"
              position="top"
              withArrow
              transition="pop"
            >
              <Flex align="center" wrap="wrap" direction="column">
                <LikeThemeIcon />
                <Text>{sumThemeLikes}</Text>
              </Flex>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              label="開発情報のいいねの合計"
              position="top"
              withArrow
              transition="pop"
            >
              <Flex align="center" wrap="wrap" direction="column">
                <LikeDeveloperIcon />
                <Text>{themeDeveloperLikes}</Text>
              </Flex>
            </Tooltip>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}
