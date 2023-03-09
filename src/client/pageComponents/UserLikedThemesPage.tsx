import { Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { TbHeart } from "react-icons/tb";
import { pageObjSchema } from "../../share/schema";
import { ThemeCardContainer } from "../features/theme/ThemeCardContainer";
import { useLikedThemesPerPage } from "../features/theme/useLikedThemesPerPage";
import { UserDetailLayout } from "../features/user/UserDetail/UserDetailLayout";
import { useURLParams } from "../lib/useURLParams";

type Props = { user: User };

export const UserLikedThemesPage: React.FC<Props> = ({ user }) => {
  const [{ page }, setURLParams] = useURLParams(pageObjSchema);
  const { likedThemesPerPage } = useLikedThemesPerPage(user.id, page);
  const mantineTheme = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <UserDetailLayout
      pageType="like"
      user={user}
      page={page}
      onChangePostPage={handleChangePage}
      totalPages={likedThemesPerPage?.allPages ?? 0}
    >
      {likedThemesPerPage?.list.length === 0 ? (
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
        <ThemeCardContainer themes={likedThemesPerPage?.list ?? []} />
      )}
    </UserDetailLayout>
  );
};
