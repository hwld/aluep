import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbCode } from "react-icons/tb";
import { User } from "../../../../server/models/user";
import { AppPagination } from "../../../ui/AppPagination";
import { ThemeCardContainer } from "../../theme/ThemeCardContainer";
import { useJoinedThemesPerPage } from "../../theme/useJoinedThemesPerPage";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserJoinedThemes: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { joinedThemesPerPage } = useJoinedThemesPerPage(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {joinedThemesPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column">
          <TbCode size="200" color={colors.red[7]} />
          <Text size="xl" color="gray.5">
            開発したお題がありません。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={joinedThemesPerPage?.list ?? []} />
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={joinedThemesPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
