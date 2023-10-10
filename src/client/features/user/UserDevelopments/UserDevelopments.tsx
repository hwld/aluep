import { useDevsByUser } from "@/client/features/dev/useDevsByUser";
import { UserContentContainer } from "@/client/features/user/UserContentContainer/UserContentContainer";
import {
  UserDevelopmentCard,
  userDevelopmentCardMinWidthPx,
} from "@/client/features/user/UserDevelopmentCard/UserDevelopmentCard";
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

  return (
    <UserContentContainer
      itemMinWidthPx={userDevelopmentCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={userDevelopments?.allPages ?? 0}
      emptyProps={{
        isEmpty: userDevelopments?.list.length === 0,
        icon: <TbCode size="100" color="var(--mantine-color-red-7)" />,
        text: "お題の開発情報がありません",
        description: (
          <>
            ユーザーがお題を開発すると、<br></br>ここに表示されます。
          </>
        ),
      }}
    >
      {userDevelopments?.list.map((dev) => (
        <UserDevelopmentCard key={dev.id} development={dev} />
      ))}
    </UserContentContainer>
  );
};
