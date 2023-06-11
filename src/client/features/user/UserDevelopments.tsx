import { Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbCode } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { AppPagination } from "../../ui/AppPagination";
import { GridContainer } from "../../ui/GridContainer";
import { useUserDevelopmentsPerPage } from "../development/useUserDevelopmentsPerPage";
import {
  UserDevelopmentCard,
  userDevelopmentCardMinWidthPx,
} from "./UserDevelopmentCard";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserDevelopments: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { userDevelopmentsPerPage } = useUserDevelopmentsPerPage(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%">
      {userDevelopmentsPerPage?.list.length === 0 ? (
        <Flex align="center" direction="column">
          <TbCode size="200" color={colors.red[7]} />
          <Text size="xl" color="gray.5">
            開発したお題がありません。
          </Text>
        </Flex>
      ) : (
        <GridContainer minItemWidthPx={userDevelopmentCardMinWidthPx}>
          {userDevelopmentsPerPage?.list.map((dev) => (
            <UserDevelopmentCard
              key={dev.developmentId}
              userDevelopment={dev}
            />
          ))}
        </GridContainer>
      )}

      <AppPagination
        page={page}
        onChange={onChangePage}
        total={userDevelopmentsPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
