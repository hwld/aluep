import { useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { IdeaCard, ideaCardMinWidthPx } from "../idea/IdeaCard/IdeaCard";
import { useLikedIdeas } from "../idea/useLikedIdeas";
import { UserContentContainer } from "./UserContentContainer";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserLikedIdeas: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { likedIdeas } = useLikedIdeas({ userId: user.id, page });
  const { colors } = useMantineTheme();

  return (
    <UserContentContainer
      itemMinWidthPx={ideaCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={likedIdeas?.allPages ?? 0}
      isEmpty={likedIdeas?.list.length === 0}
      emptyIcon={
        <TbHeart
          size="100"
          color="transparent"
          fill={colors.red[7]}
          style={{ position: "relative", top: "10px" }}
        />
      }
      emptyText="お題のいいねがありません"
      emptyDescription={
        <>
          ユーザーがお題にいいねすると、<br></br>
          ここに表示されます。
        </>
      }
    >
      {likedIdeas?.list.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </UserContentContainer>
  );
};
