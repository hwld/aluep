import { Button, Card, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef } from "react";
import { User } from "../../../server/models/user";
import { IdeaCommentFormData } from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { useCyclicRandom } from "../../lib/useCyclicRandom";
import { useRequireLoginModal } from "../session/RequireLoginModalProvider";
import { useSessionQuery } from "../session/useSessionQuery";
import { IdeaCommentCard } from "./IdeaCommentCard";
import { IdeaCommentForm, IdeaCommentFormRef } from "./IdeaCommentForm";
import { useIdeaComments } from "./useIdeaComments";

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

  const handleSubmitComment = (
    data: OmitStrict<IdeaCommentFormData, "ideaId">
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

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleFocusCommentInput = () => {
    commentFormRef.current?.focusCommentInput();
  };

  // コメントが追加されたときにのみスクロールしたいので、
  // 一つ前のレンダリングのコメント数を保持しておくrefを作成する
  const prevComments = useRef(ideaComments?.length ?? 0);
  useEffect(() => {
    const comments = ideaComments?.length ?? 0;

    // 前のレンダリングよりもコメント数が増えていればスクロールさせる
    if (comments > prevComments.current) {
      commentFormRef.current?.scrollIntoView();
    }

    // 前のレンダリングのコメント数を更新する
    prevComments.current = comments;
  }, [ideaComments?.length]);

  return (
    <Stack>
      <Title mt={30} order={4}>
        投稿されたコメント
      </Title>
      {ideaComments && ideaComments.length > 0 && (
        <Stack spacing="xs">
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
