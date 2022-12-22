import { Flex, Pagination } from "@mantine/core";
import { Session } from "next-auth";
import React from "react";
import { useJoinThemesQuery } from "../../hooks/useJoinThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailPage } from "./UserDetail";

type Props = { user: Session["user"] };

export const UserDetailJoinPage: React.FC<Props> = ({ user }) => {
  const [joinPage, setJoinPage] = usePaginationState({});
  const { joinThemes } = useJoinThemesQuery(user.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailPage user={user} state="join" />

      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {joinThemes?.joinPostedTheme.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <Pagination
          page={joinPage}
          onChange={setJoinPage}
          total={joinThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
