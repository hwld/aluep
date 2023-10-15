import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { useDevLikeOnDetail } from "@/client/features/dev/useDevLikeOnDetail";
import { DevMemoFormCard } from "@/client/features/devMemo/DevMemoFormCard/DevMemoFormCard";
import { DevMemoThreadCard } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoThreadCard";
import { useDevMemos } from "@/client/features/devMemo/useDevMemos";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { trpc } from "@/client/lib/trpc";
import { useAutoScrollOnIncrease } from "@/client/lib/useAutoScrollOnIncrease";
import { useCyclicRandom } from "@/client/lib/useCyclicRandom";
import { showErrorNotification } from "@/client/lib/utils";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Dev } from "@/models/dev";
import { DevMemoFormData } from "@/models/devMemo";
import { Idea } from "@/models/idea";
import { Card, Center, Flex, Stack, Switch, Title } from "@mantine/core";
import React, { useRef } from "react";
import { TbCode, TbNote } from "react-icons/tb";

type Props = { dev: Dev; idea: Idea };

export const DevDetailPage: React.FC<Props> = ({ dev, idea }) => {
  const memoFormCardRef = useRef<HTMLDivElement | null>(null);

  const { session } = useSessionQuery();
  const loggedInUser = session?.user;
  const isDeveloper = dev.developer.id === loggedInUser?.id;

  const { devMemoThreads, createMemoMutation } = useDevMemos({
    devId: dev.id,
  });

  const { likeDevMutation, unlikeDevMutation } = useDevLikeOnDetail(dev.id);

  const toggleAllowOtherUserMemosMutation =
    trpc.dev.updateAllowOtherUserMemos.useMutation({
      onError: () => {
        showErrorNotification({
          title: "開発メモの返信権限の更新",
          message: "開発メモの返信権限を更新できませんでした。",
        });
      },
    });

  const { openLoginModal } = useRequireLoginModal();
  const [formKey, nextFormKey] = useCyclicRandom();

  const handleToggleDevLike = () => {
    if (!session) {
      openLoginModal();
      return;
    }

    if (dev.likedByLoggedInUser) {
      unlikeDevMutation.mutate({ devId: dev.id });
    } else {
      likeDevMutation.mutate({ devId: dev.id });
    }
  };

  const handleSubmitMemo = (data: DevMemoFormData) => {
    createMemoMutation.mutate(
      { ...data, devId: dev.id },
      {
        onSuccess: () => {
          nextFormKey();
        },
      }
    );
  };

  const handleToggleAllowOtherUserMemos = () => {
    toggleAllowOtherUserMemosMutation.mutate({
      devId: dev.id,
      allowOtherUserMemos: !dev.allowOtherUserMemos,
    });
  };

  // メモスレッドが追加されたらスクロールさせる
  useAutoScrollOnIncrease({
    target: memoFormCardRef,
    count: devMemoThreads.length,
  });

  return (
    <>
      <PageHeader icon={TbCode} pageName="開発情報の詳細" />
      <Stack maw={1200} w="100%" m="auto" gap={40}>
        <DevDetailCard
          dev={dev}
          onToggleDevLike={handleToggleDevLike}
          isDeveloper={isDeveloper}
        />
        <Stack gap="xl">
          <Flex align="center" justify="space-between" gap="xl">
            <Title order={4}>開発メモ</Title>
            {isDeveloper && (
              <Card>
                <Switch
                  checked={dev.allowOtherUserMemos}
                  onChange={handleToggleAllowOtherUserMemos}
                  label="他のユーザーの返信を許可"
                  styles={{
                    track: { cursor: "pointer" },
                    label: { cursor: "pointer", userSelect: "none" },
                  }}
                />
              </Card>
            )}
          </Flex>
          {devMemoThreads.length === 0 ? (
            <Card py={40}>
              <Center h="100%">
                <EmptyContentItem
                  icon={
                    <TbNote size={120} color="var(--mantine-color-gray-7)" />
                  }
                  text="開発メモがありません"
                  description={
                    <>
                      開発時に問題に直面したり、知見をまとめたいときに<br></br>
                      開発メモを残すことができます。
                    </>
                  }
                />
              </Center>
            </Card>
          ) : (
            <Stack gap="xs">
              {devMemoThreads.map((thread) => {
                return (
                  <DevMemoThreadCard
                    ideaId={idea.id}
                    key={thread.rootMemo.id}
                    memo={thread.rootMemo}
                    devId={dev.id}
                    childrenMemos={thread.children}
                    loggedInUserId={loggedInUser?.id}
                  />
                );
              })}
            </Stack>
          )}
          {loggedInUser && isDeveloper && (
            <DevMemoFormCard
              ref={memoFormCardRef}
              key={formKey}
              loggedInUser={loggedInUser}
              onSubmit={handleSubmitMemo}
              isSubmitting={createMemoMutation.isLoading}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};
