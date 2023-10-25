import { useDevsByUser } from "@/client/features/dev/useDevsByUser";
import { UserContentContainer } from "@/client/features/user/UserContentContainer/UserContentContainer";
import {
  UserDevCard,
  userDevCardMinWidthPx,
} from "@/client/features/user/UserDevCard/UserDevCard";
import { User } from "next-auth";
import { TbCode } from "react-icons/tb";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserDevs: React.FC<Props> = ({ user, page, onChangePage }) => {
  const { devsByUser } = useDevsByUser({
    userId: user.id,
    page,
  });

  return (
    <UserContentContainer
      itemMinWidthPx={userDevCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={devsByUser?.allPages ?? 0}
      emptyProps={{
        isEmpty: devsByUser?.list.length === 0,
        icon: <TbCode size="100" color="var(--mantine-color-red-7)" />,
        text: "お題の開発情報がありません",
        description: (
          <>
            ユーザーがお題を開発すると、<br></br>ここに表示されます。
          </>
        ),
      }}
    >
      {devsByUser?.list.map((dev) => (
        <UserDevCard key={dev.id} dev={dev} />
      ))}
    </UserContentContainer>
  );
};