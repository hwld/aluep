import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import { TbFileText } from "react-icons/tb";
import { AppPagination } from "../../../ui/AppPagination";
import { ThemeCardContainer } from "../../theme/ThemeCardContainer";
import { usePostedThemesPerPageQuery } from "../../theme/usePostedThemesQuery";

type Props = { user: User; page: number; onChangePage: (page: number) => void };
export const UserPostedThemes: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { postedThemesPerPage } = usePostedThemesPerPageQuery(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Box w="100%">
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
    </Box>
  );
};
