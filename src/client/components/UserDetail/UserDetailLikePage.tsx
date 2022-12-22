import { Flex, Pagination } from "@mantine/core";
import { Session } from "next-auth";
import React from "react";
import { useLikeThemesQuery } from "../../hooks/useLikeThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailPage } from "./UserDetail";

type Props = { user: Session["user"] };

export const UserDetailLikePage: React.FC<Props> = ({ user }) => {
  const [likePage, setLikePage] = usePaginationState({});
  const { likeThemes } = useLikeThemesQuery(user.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailPage user={user} state="like" />
      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {likeThemes?.likePostedTheme.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <Pagination
          page={likePage}
          onChange={setLikePage}
          total={likeThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
