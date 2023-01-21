import { Flex, Text } from "@mantine/core";
import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { usePaginationState } from "../../hooks/usePaginationState";
import { usePostedThemesQuery } from "../../hooks/usePostedThemesQuery";
import { ThemeCardContainer } from "../ThemeCardContainer";
import { UserDetailLayout } from "./UserDetailLayout";

type Props = { user: User };

export const UserPostedThemesPage: React.FC<Props> = ({ user }) => {
  const [postPage, setPostPage] = usePaginationState({});
  const { postedThemes } = usePostedThemesQuery(user.id, postPage);

  return (
    <UserDetailLayout
      pageType="post"
      user={user}
      page={postPage}
      onChangePostPage={setPostPage}
      totalPages={postedThemes?.allPages ?? 0}
    >
      {postedThemes?.postThemes.length === 0 ? (
        <Flex align="center" direction="column" gap={10}>
          <Image src="/logo.svg" width={200} height={200} alt="app-logo" />
          <Text size={30}>投稿したお題がありません。</Text>
          <Text size={15} color="gray.5">
            お題を投稿すると、ここに表示されます。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={postedThemes?.postThemes ?? []} />
      )}
    </UserDetailLayout>
  );
};
