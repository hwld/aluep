import { useDevsByUser } from "@/client/features/dev/useDevsByUser";
import { UserContentContainer } from "@/client/features/user/UserContentContainer";
import {
  UserDevelopmentCard,
  userDevelopmentCardMinWidthPx,
} from "@/client/features/user/UserDevelopmentCard";
import { useMantineTheme } from "@mantine/core";
import { User } from "next-auth";
import { TbCode } from "react-icons/tb";

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
  const { developmentsByUser: userDevelopments } = useDevsByUser({
    userId: user.id,
    page,
  });
  const { colors } = useMantineTheme();

  return (
    <UserContentContainer
      itemMinWidthPx={userDevelopmentCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={userDevelopments?.allPages ?? 0}
      isEmpty={userDevelopments?.list.length === 0}
      emptyIcon={<TbCode size="100" color={colors.red[7]} />}
      emptyText="お題の開発情報がありません"
      emptyDescription={
        <>
          ユーザーがお題を開発すると、<br></br>ここに表示されます。
        </>
      }
    >
      {userDevelopments?.list.map((dev) => (
        <UserDevelopmentCard key={dev.id} development={dev} />
      ))}
    </UserContentContainer>
  );
};
