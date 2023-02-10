import { Card, Stack, Title } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { useRequireLoginModal } from "../contexts/RequireLoginModalProvider";
import { useCyclicRandom } from "../hooks/useCyclicRandom";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeComments } from "../hooks/useThemeComments";
import { extractHash } from "../utils";
import { ThemeCommentCard } from "./ThemeCommentCard";
import { ThemeCommentForm } from "./ThemeCommentForm";

type Props = { themeId: string; themeOwnerId: string };

/** お題へのコメント */
export const ThemeComments: React.FC<Props> = ({ themeId, themeOwnerId }) => {
  const { session } = useSessionQuery();
  const router = useRouter();
  const { openLoginModal } = useRequireLoginModal();
  const [focusedCommentId, setFocusedCommentId] = useState("");

  const commentsRef = useClickOutside(async () => {
    if (focusedCommentId !== "") {
      // フラグメントを削除する
      // フラグメントで指定されているカードの外側のクリックでフラグメントを削除したかったのだが、
      // 別のコメントの返信元へのリンクをクリックすると、そちらでもrouter.replaceを使用しているため、
      // routingがキャンセルされてエラーが出ることがあるため、コメント全体の外側のクリックでフラグメントを削除するようにしている
      await router.replace(router.asPath.split("#")[0], undefined, {
        shallow: true,
        scroll: false,
      });
    }
  });

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

  // フラグメントで指定されているコメントを設定する
  // SSRではフラグメントを取得できないので、クライアント側だけで設定されるように
  // useEffectを使用する
  useEffect(() => {
    // ThemeCommentCardがid={comment.id}を設定しなければ
    // 動かない
    const id = extractHash(router.asPath);
    setFocusedCommentId(id);
  }, [router.asPath]);

  return (
    <Stack>
      <Title mt={30} order={4}>
        投稿されたコメント
      </Title>
      {themeComments && themeComments.length > 0 && (
        <Stack spacing="xs" ref={commentsRef}>
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
                themeOwnerId={themeOwnerId}
                focused={focusedCommentId === comment.id}
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
