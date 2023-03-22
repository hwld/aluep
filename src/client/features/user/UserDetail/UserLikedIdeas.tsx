import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { User } from "../../../../server/models/user";
import { AppPagination } from "../../../ui/AppPagination";
import { IdeaCardContainer } from "../../idea/IdeaCardContainer";
import { useLikedIdeasPerPage } from "../../idea/useLikedIdeasPerPage";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserLikedIdeas: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { likedIdeasPerPage } = useLikedIdeasPerPage(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {likedIdeasPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column">
          <TbHeart
            size="200"
            color="transparent"
            fill={colors.red[7]}
            style={{ position: "relative", top: "10px" }}
          />
          <Text size="xl" color="gray.5">
            いいねしたお題がありません。
          </Text>
        </Flex>
      ) : (
        <IdeaCardContainer ideas={likedIdeasPerPage?.list ?? []} />
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={likedIdeasPerPage?.allPages ?? 0}
        w="min-content"
      />
    </Stack>
  );
};
