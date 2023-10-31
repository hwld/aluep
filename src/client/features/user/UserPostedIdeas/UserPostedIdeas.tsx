import {
  IdeaCard,
  ideaCardMinWidthPx,
} from "@/client/features/idea/IdeaCard/IdeaCard";
import { usePostedIdeasQuery } from "@/client/features/idea/usePostedIdeasQuery";
import { UserContentContainer } from "@/client/features/user/UserContentContainer/UserContentContainer";
import { SvgFileText } from "@tabler/icons-react";
import { User } from "next-auth";

type Props = {
  user: User;
  page: number;
  onChangePage: (page: number) => void;
};
export const UserPostedIdeas: React.FC<Props> = ({
  user,
  page,
  onChangePage,
}) => {
  const { postedIdeas } = usePostedIdeasQuery({ userId: user.id, page });

  return (
    <UserContentContainer
      itemMinWidthPx={ideaCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={postedIdeas?.allPages ?? 0}
      emptyProps={{
        isEmpty: postedIdeas?.list.length === 0,
        icon: (
          <SvgFileText
            width="100"
            height="100"
            color="var(--mantine-color-red-7)"
          />
        ),
        text: "お題がありません",
        description: (
          <>
            ユーザーがお題を投稿すると、<br></br>ここに表示されます。
          </>
        ),
      }}
    >
      {postedIdeas?.list.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </UserContentContainer>
  );
};
