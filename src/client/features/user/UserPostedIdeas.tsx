import { useMantineTheme } from "@mantine/core";
import { TbFileText } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { IdeaCard, ideaCardMinWidthPx } from "../idea/IdeaCard/IdeaCard";
import { usePostedIdeasQuery } from "../idea/usePostedIdeasQuery";
import { UserContentContainer } from "./UserContentContainer";

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
  const { colors } = useMantineTheme();

  return (
    <UserContentContainer
      itemMinWidthPx={ideaCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={postedIdeas?.allPages ?? 0}
      isEmpty={postedIdeas?.list.length === 0}
      emptyIcon={<TbFileText size="100" color={colors.red[7]} />}
      emptyText="お題がありません"
      emptyDescription={
        <>
          ユーザーがお題を投稿すると、<br></br>ここに表示されます。
        </>
      }
    >
      {postedIdeas?.list.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </UserContentContainer>
  );
};
