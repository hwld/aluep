import { Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { TbHeart } from "react-icons/tb";
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
          <TbHeart
            size={200}
            color="transparent"
            fill={mantineTheme.colors.red[7]}
          />
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
