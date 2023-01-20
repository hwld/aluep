import { Card, Stack, Title } from "@mantine/core";
import { SyntheticEvent } from "react";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { useRequireLoginModal } from "../contexts/RequireLoginModalProvider";
import { useCyclicRandom } from "../hooks/useCyclicRandom";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeComments } from "../hooks/useThemeComments";
import { CommentCard } from "./CommentCard";
import { ThemeCommentForm } from "./ThemeCommentForm";

type Props = { themeId: string };

/** お題へのコメント */
export const ThemeComments: React.FC<Props> = ({ themeId }) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();
  const { themeComments, postCommentMutation, deleteCommentMutation } =
    useThemeComments(themeId);

  // コメント送信後にformを再マウントさせるために使用するkey
  const { random: formKey, nextRandom: nextFormKey } = useCyclicRandom();

  // submit前に呼び出される。
  // ログインしていなければログインモーダルを表示させる。
  const handleClickSubmit = (e: SyntheticEvent) => {
    if (!session) {
      openLoginModal();
      e.preventDefault();
    }
  };

  const handleSubmitComment = (
    data: OmitStrict<ThemeCommentFormData, "themeId">
  ) => {
    postCommentMutation.mutate(data, {
      onSuccess: () => {
        nextFormKey();
      },
    });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  return (
    <Stack>
      <Title mt={30} order={4}>
        投稿されたコメント
      </Title>
      <Stack spacing="xs">
        {themeComments?.map((comment) => {
          return (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDeleteComment={handleDeleteComment}
              isDeleting={deleteCommentMutation.isLoading}
              loggedInUserId={session?.user.id}
            />
          );
        })}
      </Stack>
      <Card>
        <ThemeCommentForm
          key={formKey}
          themeId={themeId}
          onSubmit={handleSubmitComment}
          onClickSubmitButton={handleClickSubmit}
          isSubmitting={postCommentMutation.isLoading}
        />
      </Card>
    </Stack>
  );
};
