import { Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { TbFileText } from "react-icons/tb";
import { useJoinedThemesQuery } from "../../hooks/useJoinedThemesQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { ThemeCardContainer } from "../ThemeCardContainer";
import { UserDetailLayout } from "./UserDetailLayout";

type Props = { user: User };

export const UserJoinedThemesPage: React.FC<Props> = ({ user }) => {
  const [joinPage, setJoinPage] = usePaginationState({});
  const { joinedThemes } = useJoinedThemesQuery(user.id, joinPage);
  const mantineTheme = useMantineTheme();

  return (
    <UserDetailLayout
      pageType="join"
      user={user}
      page={joinPage}
      onChangePostPage={setJoinPage}
      totalPages={joinedThemes?.allPages ?? 0}
    >
      {joinedThemes?.joinPostedTheme.length === 0 ? (
        <Flex align="center" direction="column" gap={10}>
          <TbFileText color={mantineTheme.colors.red[7]} size={200} />
          <Text size={30}>参加したお題がありません。</Text>
          <Text size={15} color="gray.5">
            お題に参加すると、ここに表示されます。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={joinedThemes?.joinPostedTheme ?? []} />
      )}
    </UserDetailLayout>
  );
};
