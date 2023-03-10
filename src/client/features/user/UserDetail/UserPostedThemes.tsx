import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbFileText } from "react-icons/tb";
import { User } from "../../../../server/models/user";
import { AppPagination } from "../../../ui/AppPagination";
import { ThemeCardContainer } from "../../theme/ThemeCardContainer";
import { usePostedThemesPerPageQuery } from "../../theme/usePostedThemesQuery";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserPostedThemes: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { postedThemesPerPage } = usePostedThemesPerPageQuery(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {postedThemesPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column">
          <TbFileText size="200" color={colors.red[7]} />
          <Text size="xl" color="gray.5">
            投稿したお題がありません。
          </Text>
        </Flex>
      ) : (
        <ThemeCardContainer themes={postedThemesPerPage?.list ?? []} />
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={postedThemesPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
