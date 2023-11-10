import { DevCard } from "@/client/features/dev/DevCard/DevCard";
import { useLikedDevs } from "@/client/features/dev/useLikedDevs";
import { UserContentContainer } from "@/client/features/user/UserContentContainer/UserContentContainer";
import { IconHeartFilled } from "@tabler/icons-react";
import { User } from "next-auth";

type Props = { user: User; page: number; onChangePage: (page: number) => void };

export const UserLikedDevs: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { likedDevs } = useLikedDevs({
    userId: user.id,
    page,
  });

  return (
    <UserContentContainer
      itemMinWidthPx={450}
      page={page}
      onChangePage={onChangePage}
      totalPages={likedDevs?.allPages ?? 0}
      emptyProps={{
        isEmpty: likedDevs?.list.length === 0,
        icon: (
          <IconHeartFilled
            width="100"
            height="100"
            style={{
              position: "relative",
              top: "10px",
              color: "var(--mantine-color-red-7)",
            }}
          />
        ),
        text: "開発情報のいいねがありません",
        description: (
          <>
            ユーザーが開発情報にいいねすると、<br></br>ここに表示されます。
          </>
        ),
      }}
    >
      {likedDevs?.list.map((dev) => (
        <DevCard key={dev.id} dev={dev} />
      ))}
    </UserContentContainer>
  );
};
