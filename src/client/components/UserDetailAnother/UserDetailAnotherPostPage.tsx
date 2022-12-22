import { Flex, Pagination } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { usePaginationState } from "../../hooks/usePaginationState";
import { usePostThemesQuery } from "../../hooks/usePostThemesQuery";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailAnotherPage } from "./UserDetailAnother";

type Props = { user: User };

export const UserDetailAnotherPostPage: React.FC<Props> = ({ user }) => {
  const [postPage, setPostPage] = usePaginationState({});
  const { postThemes } = usePostThemesQuery(user.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailAnotherPage user={user} state="post" />
      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {postThemes?.postThemes.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <Pagination
          page={postPage}
          onChange={setPostPage}
          total={postThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
