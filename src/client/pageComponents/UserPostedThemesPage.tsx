import { Flex, Text } from "@mantine/core";
import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { pageObjSchema } from "../../share/schema";
import { ThemeCardContainer } from "../features/theme/ThemeCardContainer";
import { usePostedThemesPerPageQuery } from "../features/theme/usePostedThemesQuery";
import { UserDetailLayout } from "../features/user/UserDetail/UserDetailLayout";
import { useURLParams } from "../lib/useURLParams";

type Props = { user: User };

export const UserPostedThemesPage: React.FC<Props> = ({ user }) => {
  const [{ page }, setURLParams] = useURLParams(pageObjSchema);
  const { postedThemesPerPage } = usePostedThemesPerPageQuery(user.id, page);

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <UserDetailLayout
      pageType="post"
      user={user}
      page={page}
      onChangePostPage={handleChangePage}
      totalPages={postedThemesPerPage?.allPages ?? 0}
    >
      {postedThemesPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column" gap={10}>
          <Image src="/logo.svg" width={200} height={200} alt="app-logo" />
          <Text size={30}>投稿したお題がありません。</Text>
          <Text size={15} color="gray.5">
            お題を投稿すると、ここに表示されます。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={postedThemesPerPage?.list ?? []} />
      )}
    </UserDetailLayout>
  );
};
