import { Flex } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { useLikedThemesQuery } from "../../hooks/useLikedThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { AppPagination } from "../AppPagination";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailPage } from "./UserDetail";

type Props = { user: User };

export const UserLikedThemesPage: React.FC<Props> = ({ user }) => {
  const [likePage, setLikePage] = usePaginationState({});
  const { likedThemes } = useLikedThemesQuery(user.id, likePage);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailPage user={user} state="like" />
      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {likedThemes?.likePostedTheme.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <AppPagination
          page={likePage}
          onChange={setLikePage}
          total={likedThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
