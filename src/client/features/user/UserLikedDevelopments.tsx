import { useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { LikedDevelopmentCard } from "../development/LikedDevelopmentCard";
import { useLikedDevelopmentsPerPage } from "../development/useLikedDevelopmentsPerPage";
import { UserContentContainer } from "./UserContentContainer";

type Props = { user: User; page: number; onChangePage: (page: number) => void };

export const UserLikedDevelopments: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { likedDevelopmentsPerPage } = useLikedDevelopmentsPerPage(
    user.id,
    page
  );
  const { colors } = useMantineTheme();

  return (
    <UserContentContainer
      itemMinWidthPx={450}
      page={page}
      onChangePage={onChangePage}
      totalPages={likedDevelopmentsPerPage?.allPages ?? 0}
      isEmpty={likedDevelopmentsPerPage?.list.length === 0}
      emptyIcon={
        <TbHeart
          size="200"
          color="transparent"
          fill={colors.red[7]}
          style={{ position: "relative", top: "10px" }}
        />
      }
      emptyText="まだ開発情報へのいいねがありません。"
    >
      {likedDevelopmentsPerPage?.list.map((dev) => (
        <LikedDevelopmentCard key={dev.id} development={dev} />
      ))}
    </UserContentContainer>
  );
};
