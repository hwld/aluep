import { IdeaCommentCard } from "@/client/features/ideaComment/IdeaComments/IdeaCommentCard/IdeaCommentCard";
import {
  IdeaCommentForm,
  IdeaCommentFormRef,
} from "@/client/features/ideaComment/IdeaComments/IdeaCommentForm/IdeaCommentForm";
import { useIdeaComments } from "@/client/features/ideaComment/useIdeaComments";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { useAutoScrollOnIncrease } from "@/client/lib/useAutoScrollOnIncrease";
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
  const { ideaComments } = useIdeaComments({ ideaId });

  const handleOpenLoginModal = () => {
    openLoginModal();
  };

  const commentFormRef = useRef<IdeaCommentFormRef | null>(null);

  const handleFocusCommentInput = () => {
    commentFormRef.current?.focusCommentInput();
  };

  // コメントの数が増えたら自動でスクロールする
  // TODO: 画面遷移でスクロールしちゃうことがある
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
            loggedInUser={loggedInUser}
            ideaId={ideaId}
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
