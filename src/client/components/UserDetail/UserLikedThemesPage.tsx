import { User } from "@prisma/client";
import React from "react";
import { useLikedThemesQuery } from "../../hooks/useLikedThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { ThemeCardContainer } from "../ThemeCardContainer";
import { UserDetailLayout } from "./UserDetailLayout";

type Props = { user: User };

export const UserLikedThemesPage: React.FC<Props> = ({ user }) => {
  const [likePage, setLikePage] = usePaginationState({});
  const { likedThemes } = useLikedThemesQuery(user.id, likePage);

  return (
    <UserDetailLayout
      pageType="like"
      user={user}
      page={likePage}
      onChangePostPage={setLikePage}
      totalPages={likedThemes?.allPages ?? 0}
    >
      <ThemeCardContainer themes={likedThemes?.likePostedTheme ?? []} />
    </UserDetailLayout>
  );
};
