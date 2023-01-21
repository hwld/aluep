import { Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useLikedThemesQuery } from "../../hooks/useLikedThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { ThemeCardContainer } from "../ThemeCardContainer";
import { UserDetailLayout } from "./UserDetailLayout";

type Props = { user: User };

export const UserLikedThemesPage: React.FC<Props> = ({ user }) => {
  const [likePage, setLikePage] = usePaginationState({});
  const { likedThemes } = useLikedThemesQuery(user.id, likePage);
  const mantineTheme = useMantineTheme();

  return (
    <UserDetailLayout
      pageType="like"
      user={user}
      page={likePage}
      onChangePostPage={setLikePage}
      totalPages={likedThemes?.allPages ?? 0}
    >
      {likedThemes?.likePostedTheme.length === 0 ? (
        <Flex align="center" direction="column" gap={10}>
          <MdOutlineFavorite color={mantineTheme.colors.red[7]} size={200} />
          <Text size={30}>いいねをしたお題がありません。</Text>
          <Text size={15} color="gray.5">
            お題にいいねすると、ここに表示されます。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={likedThemes?.likePostedTheme ?? []} />
      )}
    </UserDetailLayout>
  );
};
