import { Flex } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { usePaginationState } from "../../hooks/usePaginationState";
import { usePostedThemesQuery } from "../../hooks/usePostedThemesQuery";
import { AppPagination } from "../AppPagination";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailPage } from "./UserDetail";

type Props = { user: User };

export const UserPostedThemesPage: React.FC<Props> = ({ user }) => {
  const [postPage, setPostPage] = usePaginationState({});
  const { postedThemes } = usePostedThemesQuery(user.id, postPage);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailPage user={user} state="post" />
      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {postedThemes?.postThemes.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <AppPagination
          page={postPage}
          onChange={setPostPage}
          total={postedThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
