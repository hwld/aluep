import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import { TbHeart } from "react-icons/tb";
import { AppPagination } from "../../../ui/AppPagination";
import { ThemeCardContainer } from "../../theme/ThemeCardContainer";
import { useLikedThemesPerPage } from "../../theme/useLikedThemesPerPage";

type Props = { user: User; page: number; onChangePage: (page: number) => void };
export const UserLikedThemes: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { likedThemesPerPage } = useLikedThemesPerPage(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {likedThemesPerPage?.list.length === 0 ? (
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
        <ThemeCardContainer themes={likedThemesPerPage?.list ?? []} />
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={likedThemesPerPage?.allPages ?? 0}
        w="min-content"
      />
    </Stack>
  );
};
