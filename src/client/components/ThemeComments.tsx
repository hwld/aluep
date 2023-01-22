import { Card, Stack, Title } from "@mantine/core";
import { SyntheticEvent } from "react";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { useRequireLoginModal } from "../contexts/RequireLoginModalProvider";
import { useCyclicRandom } from "../hooks/useCyclicRandom";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeComments } from "../hooks/useThemeComments";
import { ThemeCommentCard } from "./ThemeCommentCard";
import { ThemeCommentForm } from "./ThemeCommentForm";

type Props = { themeId: string };

/** お題へのコメント */
export const ThemeComments: React.FC<Props> = ({ themeId }) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  // お題のコメント操作
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
        // Formのkeyを変更して再マウントさせる。
        // これでFormのフィールドがリセットされ、submitボタンを一度も押していないことになる。
        // handleSubmitCommentでフィールドをリセットするメソッドを受けとり、onSuccessで実行することも
        // できるが、submitを一度押していることになるので、コメント欄に入力->入力をすべて削除でエラーメッセージが表示されてしまう
        nextFormKey();
      },
    });
  };

  const handleSubmitReply = (
    data: OmitStrict<ThemeCommentFormData, "themeId">,
    onSuccess: () => void
  ) => {
    postCommentMutation.mutate(data, { onSuccess });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  // TODO: サーバー側でThemeCommentに含めたほうが良い？
  // commentIdからユーザー名を取得する
  const getUserNameByCommentId = (
    commentId: string | null | undefined
  ): string => {
    return (
      themeComments?.find((comment) => comment.id === commentId)?.fromUser
        .name ?? "不明なユーザー名"
    );
  };

  return (
    <Stack>
      <Title mt={30} order={4}>
        投稿されたコメント
      </Title>
      {themeComments && themeComments.length > 1 && (
        <Stack spacing="xs">
          {themeComments.map((comment) => {
            return (
              <ThemeCommentCard
                key={comment.id}
                comment={comment}
                inReplyToUserName={getUserNameByCommentId(
                  comment.inReplyToCommentId
                )}
                onReplyComment={handleSubmitReply}
                onDeleteComment={handleDeleteComment}
                isDeleting={deleteCommentMutation.isLoading}
                loggedInUserId={session?.user.id}
              />
            );
          })}
        </Stack>
      )}
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
