import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbCode } from "react-icons/tb";
import { User } from "../../../../server/models/user";
import { AppPagination } from "../../../ui/AppPagination";
import { IdeaCardContainer } from "../../idea/IdeaCardContainer";
import { useDevelopedIdeasPerPage } from "../../idea/useDevelopedIdeasPerPage";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
// TODO: 開発状況とかも合わせて表示させたい
export const UserDevelopedIdeas: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { developedIdeasPerPage } = useDevelopedIdeasPerPage(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {developedIdeasPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column">
          <TbCode size="200" color={colors.red[7]} />
          <Text size="xl" color="gray.5">
            開発したお題がありません。
          </Text>
        </Flex>
      ) : (
        <IdeaCardContainer ideas={developedIdeasPerPage?.list ?? []} />
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={developedIdeasPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
