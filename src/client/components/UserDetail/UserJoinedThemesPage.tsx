import { User } from "@prisma/client";
import React from "react";
import { useJoinedThemesQuery } from "../../hooks/useJoinedThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { ThemeCardContainer } from "../ThemeCardContainer";
import { UserDetailLayout } from "./UserDetailLayout";

type Props = { user: User };

export const UserJoinedThemesPage: React.FC<Props> = ({ user }) => {
  const [joinPage, setJoinPage] = usePaginationState({});
  const { joinedThemes } = useJoinedThemesQuery(user.id, joinPage);

  return (
    <UserDetailLayout
      pageType="join"
      user={user}
      page={joinPage}
      onChangePostPage={setJoinPage}
      totalPages={joinedThemes?.allPages ?? 0}
    >
      <ThemeCardContainer themes={joinedThemes?.joinPostedTheme ?? []} />
    </UserDetailLayout>
  );
};
