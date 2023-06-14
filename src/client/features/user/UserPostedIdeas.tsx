import { useMantineTheme } from "@mantine/core";
import { TbFileText } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { IdeaCard, ideaCardMinWidthPx } from "../idea/IdeaCard/IdeaCard";
import { usePostedIdeasPerPageQuery } from "../idea/usePostedIdeasQuery";
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
  const { postedIdeasPerPage } = usePostedIdeasPerPageQuery(user.id, page);
  const { colors } = useMantineTheme();

  return (
    <UserContentContainer
      itemMinWidthPx={ideaCardMinWidthPx}
      page={page}
      onChangePage={onChangePage}
      totalPages={postedIdeasPerPage?.allPages ?? 0}
      isEmpty={postedIdeasPerPage?.list.length === 0}
      emptyIcon={<TbFileText size="200" color={colors.red[7]} />}
      emptyText="まだお題がありません。"
    >
      {postedIdeasPerPage?.list.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </UserContentContainer>
  );
};
