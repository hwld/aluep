import { useMantineTheme } from "@mantine/core";
import { TbCode } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { useUserDevelopmentsPerPage } from "../development/useUserDevelopmentsPerPage";
import { UserContentContainer } from "./UserContentContainer";
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
    <UserContentContainer
      itemMinWidthPx={userDevelopmentCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={userDevelopmentsPerPage?.allPages ?? 0}
      isEmpty={userDevelopmentsPerPage?.list.length === 0}
      emptyIcon={<TbCode size="100" color={colors.red[7]} />}
      emptyText="お題の開発情報がありません"
      emptyDescription={
        <>
          ユーザーがお題を開発すると、<br></br>ここに表示されます。
        </>
      }
    >
      {userDevelopmentsPerPage?.list.map((dev) => (
        <UserDevelopmentCard key={dev.id} development={dev} />
      ))}
    </UserContentContainer>
  );
};
