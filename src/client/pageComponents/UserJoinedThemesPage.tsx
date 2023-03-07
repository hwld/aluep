import { Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import { TbFileText } from "react-icons/tb";
import { ThemeCardContainer } from "../features/theme/ThemeCardContainer";
import { useJoinedThemesPerPage } from "../features/theme/useJoinedThemesPerPage";
import { UserDetailLayout } from "../features/user/UserDetail/UserDetailLayout";
import { usePaginationState } from "../lib/usePaginationState";

type Props = { user: User };

export const UserJoinedThemesPage: React.FC<Props> = ({ user }) => {
  const [joinPage, setJoinPage] = usePaginationState({});
  const { joinedThemesPerPage } = useJoinedThemesPerPage(user.id, joinPage);
  const mantineTheme = useMantineTheme();

  return (
    <UserDetailLayout
      pageType="join"
      user={user}
      page={joinPage}
      onChangePostPage={setJoinPage}
      totalPages={joinedThemesPerPage?.allPages ?? 0}
    >
      {joinedThemesPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column" gap={10}>
          <TbFileText color={mantineTheme.colors.red[7]} size={200} />
          <Text size={30}>開発したお題がありません。</Text>
          <Text size={15} color="gray.5">
            お題の開発を開始すると、ここに表示されます。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={joinedThemesPerPage?.list ?? []} />
      )}
    </UserDetailLayout>
  );
};
