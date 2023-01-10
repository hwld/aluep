import { User } from "@prisma/client";
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
      <ThemeCardContainer themes={postedThemes?.postThemes ?? []} />
    </UserDetailLayout>
  );
};
