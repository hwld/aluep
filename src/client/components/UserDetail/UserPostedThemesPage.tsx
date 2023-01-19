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
        <Flex align="center" direction="column">
          <Image src="/logo.svg" width={200} height={200} alt="app-logo" />
          <Text size={20}>投稿したお題がありません。</Text>
        </Flex>
      ) : (
        "b"
      )}
      <ThemeCardContainer themes={postedThemes?.postThemes ?? []} />
    </UserDetailLayout>
  );
};
