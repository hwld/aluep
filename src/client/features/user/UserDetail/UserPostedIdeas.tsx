import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbFileText } from "react-icons/tb";
import { User } from "../../../../server/models/user";
import { AppPagination } from "../../../ui/AppPagination";
import { IdeaCardContainer } from "../../idea/IdeaCardContainer";
import { usePostedIdeasPerPageQuery } from "../../idea/usePostedIdeasQuery";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserPostedIdeas: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { postedIdeasPerPage } = usePostedIdeasPerPageQuery(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {postedIdeasPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column">
          <TbFileText size="200" color={colors.red[7]} />
          <Text size="xl" color="gray.5">
            投稿したお題がありません。
          </Text>
        </Flex>
      ) : (
        <IdeaCardContainer ideas={postedIdeasPerPage?.list ?? []} />
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={postedIdeasPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
