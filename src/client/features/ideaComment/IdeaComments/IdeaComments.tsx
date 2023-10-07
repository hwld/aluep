import { IdeaCommentCard } from "@/client/features/ideaComment/IdeaCommentCard/IdeaCommentCard";
import {
  IdeaCommentForm,
  IdeaCommentFormRef,
} from "@/client/features/ideaComment/IdeaCommentForm/IdeaCommentForm";
import { useIdeaComments } from "@/client/features/ideaComment/useIdeaComments";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { useAutoScrollOnIncrease } from "@/client/lib/useAutoScrollOnIncrease";
import { useCyclicRandom } from "@/client/lib/useCyclicRandom";
import { IdeaCommentFormData } from "@/models/ideaComment";
import { Button, Card, Stack, Text, Title } from "@mantine/core";
import { User } from "next-auth";
import { useRef } from "react";

type Props = { ideaId: string; ideaOwnerId: string; loggedInUser?: User };

/** お題へのコメント */
export const IdeaComments: React.FC<Props> = ({
  ideaId,
  ideaOwnerId,
  loggedInUser,
}) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();
  const commentFormRef = useRef<IdeaCommentFormRef | null>(null);

  // お題のコメント操作
  const { ideaComments, postCommentMutation, deleteCommentMutation } =
    useIdeaComments({ ideaId });

  // コメント送信後にformを再マウントさせるために使用するkey
  const [formKey, nextFormKey] = useCyclicRandom();

  const handleOpenLoginModal = () => {
    openLoginModal();
  };

  const handleSubmitComment = (data: IdeaCommentFormData) => {
    postCommentMutation.mutate(
      { ...data, ideaId },
      {
        onSuccess: () => {
          // Formのkeyを変更して再マウントさせる。
          // これでFormのフィールドがリセットされ、submitボタンを一度も押していないことになる。
          // handleSubmitCommentでフィールドをリセットするメソッドを受けとり、onSuccessで実行することも
          // できるが、submitを一度押していることになるので、コメント欄に入力->入力をすべて削除でエラーメッセージが表示されてしまう
          nextFormKey();
        },
      }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleFocusCommentInput = () => {
    commentFormRef.current?.focusCommentInput();
  };

  // コメントの数が増えたら自動でスクロールする
  useAutoScrollOnIncrease({
    target: commentFormRef,
    count: ideaComments?.length ?? 0,
  });

  return (
    <Stack>
      <Title mt={30} order={4}>
        投稿されたコメント
      </Title>
      {ideaComments && ideaComments.length > 0 && (
        <Stack gap="xs">
          {ideaComments.map((comment) => {
            return (
              <IdeaCommentCard
                key={comment.id}
                comment={comment}
                ideaId={ideaId}
                onDeleteComment={handleDeleteComment}
                isDeleting={deleteCommentMutation.isLoading}
                isOwner={session?.user.id === comment.fromUser.id}
                ideaOwnerId={ideaOwnerId}
              />
            );
          })}
        </Stack>
      )}
      {loggedInUser ? (
        <Card onClick={handleFocusCommentInput}>
          <IdeaCommentForm
            ref={commentFormRef}
            key={formKey}
            loggedInUser={loggedInUser}
            ideaId={ideaId}
            onSubmit={handleSubmitComment}
            isSubmitting={postCommentMutation.isLoading}
          />
        </Card>
      ) : (
        <Card p="xl">
          <Stack align="center">
            <Text>ログインするとコメントできます</Text>
            <Button onClick={handleOpenLoginModal}>ログイン</Button>
          </Stack>
        </Card>
      )}
    </Stack>
  );
};