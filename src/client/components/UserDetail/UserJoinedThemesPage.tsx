import { Flex } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { useJoinedThemesQuery } from "../../hooks/useJoinedThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { AppPagination } from "../AppPagination";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailPage } from "./UserDetail";

type Props = { user: User };

export const UserJoinedThemesPage: React.FC<Props> = ({ user }) => {
  const [joinPage, setJoinPage] = usePaginationState({});
  const { joinedThemes } = useJoinedThemesQuery(user.id, joinPage);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailPage user={user} state="join" />

      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {joinedThemes?.joinPostedTheme.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <AppPagination
          page={joinPage}
          onChange={setJoinPage}
          total={joinedThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
