import {
  IdeaCard,
  ideaCardMinWidthPx,
} from "@/client/features/idea/IdeaCard/IdeaCard";
import { useLikedIdeas } from "@/client/features/idea/useLikedIdeas";
import { UserContentContainer } from "@/client/features/user/UserContentContainer/UserContentContainer";
import { SvgHeartFilled } from "@tabler/icons-react";
import { User } from "next-auth";

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

  return (
    <UserContentContainer
      itemMinWidthPx={ideaCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={likedIdeas?.allPages ?? 0}
      emptyProps={{
        isEmpty: likedIdeas?.list.length === 0,
        icon: (
          <SvgHeartFilled
            width="100"
            height="100"
            color="var(--mantine-color-red-7)"
            style={{ position: "relative", top: "10px" }}
          />
        ),
        text: "お題のいいねがありません",
        description: (
          <>
            ユーザーがお題にいいねすると、<br></br>
            ここに表示されます。
          </>
        ),
      }}
    >
      {likedIdeas?.list.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </UserContentContainer>
  );
};
