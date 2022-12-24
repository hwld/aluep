import { Flex } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { useLikeThemesQuery } from "../../hooks/useLikeThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { AppPagination } from "../AppPagination";
import { ThemeCard } from "../ThemeCard/ThemeCard";
import { UserDetailAnotherPage } from "./UserDetailAnother";

type Props = { user: User };

export const UserDetailAnotherLikePage: React.FC<Props> = ({ user }) => {
  const [likePage, setLikePage] = usePaginationState({});
  const { likeThemes } = useLikeThemesQuery(user.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <UserDetailAnotherPage user={user} state="like" />
      <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
        {likeThemes?.likePostedTheme.map((theme) => {
          return <ThemeCard key={theme.id} theme={theme} />;
        })}

        <AppPagination
          page={likePage}
          onChange={setLikePage}
          total={likeThemes?.allPages ?? 0}
        />
      </Flex>
    </Flex>
  );
};
