import { EmptyUserSearchResult } from "@/client/features/user/EmptyUserSearchResult/EmptyUserSearchResult";
import {
  UserCard,
  userCardMinWidthPx,
} from "@/client/features/user/UserCard/UserCard";
import { User } from "@/models/user";
import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { MdOutlinePersonSearch } from "react-icons/md";

type Props = {
  userSearchResult: User[];
  isEmptyKeyword: boolean;
};
export const UserSearchResultContent: React.FC<Props> = ({
  userSearchResult,
  isEmptyKeyword,
}) => {
  const { colors } = useMantineTheme();

  const isEmptyResult = userSearchResult.length === 0;

  if (isEmptyKeyword) {
    // 検索前の状態
    return (
      <Flex direction="column">
        <Flex justify="center" align="center">
          <MdOutlinePersonSearch size={100} color={colors.red[7]} />
        </Flex>
        <Text ta="center" c="gray.5">
          ユーザを検索してみよう!
        </Text>
      </Flex>
    );
  } else if (isEmptyResult) {
    // 検索結果が空
    return <EmptyUserSearchResult />;
  } else {
    // 検索結果がある
    return (
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
          gap: "var(--mantine-spacing-md)",
        }}
      >
        {userSearchResult.map((user) => {
          return <UserCard key={user.id} user={user} />;
        })}
      </Box>
    );
  }
};
