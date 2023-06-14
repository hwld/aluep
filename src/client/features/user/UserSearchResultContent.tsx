import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { MdOutlinePersonSearch } from "react-icons/md";
import { User } from "../../../server/models/user";
import { EmptyUserSearchResult } from "./EmptyUserSearchResult";
import { UserCard, userCardMinWidthPx } from "./UserCard";

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
        <Text align="center" c="gray.5">
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
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
          gap: theme.spacing.md,
        })}
      >
        {userSearchResult.map((user) => {
          return <UserCard key={user.id} user={user} />;
        })}
      </Box>
    );
  }
};
