import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { developmentKeys } from "@/client/features/dev/queryKeys";
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
import { Development } from "@/models/development";
import { DevelopmentMemoFormData } from "@/models/developmentMemo";
import { Idea } from "@/models/idea";
import {
  Card,
  Center,
  Flex,
  Stack,
  Switch,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import { MdComputer } from "react-icons/md";
import { TbNote } from "react-icons/tb";

type Props = { development: Development; idea: Idea };

export const DevelopmentDetailPage: React.FC<Props> = ({
  development,
  idea,
}) => {
  const { colors } = useMantineTheme();

  const memoFormCardRef = useRef<HTMLDivElement | null>(null);

  const { session } = useSessionQuery();
  const loggedInUser = session?.user;
  const isDeveloper = development.developerUserId === loggedInUser?.id;

  const { developmentMemoThreads, createMemoMutation } = useDevMemos({
    developmentId: development.id,
  });

  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useDevLikeOnDetail(development.id);

  const queryClient = useQueryClient();
  const toggleAllowOtherUserMemosMutation = useMutation({
    mutationFn: () => {
      return trpc.development.updateAllowOtherUserMemos.mutate({
        developmentId: development.id,
        allowOtherUserMemos: !development.allowOtherUserMemos,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(developmentKeys.detail(development.id));
    },
    onError: () => {
      showErrorNotification({
        title: "開発メモの返信権限の更新",
        message: "開発メモの返信権限を更新できませんでした。",
      });
    },
  });

  const { openLoginModal } = useRequireLoginModal();
  const [formKey, nextFormKey] = useCyclicRandom();

  const handleToggleDevelopmentLike = () => {
    if (!session) {
      openLoginModal();
      return;
    }

    if (development.likedByLoggedInUser) {
      unlikeDevelopmentMutation.mutate({ developmentId: development.id });
    } else {
      likeDevelopmentMutation.mutate({ developmentId: development.id });
    }
  };

  const handleSubmitMemo = (data: DevelopmentMemoFormData) => {
    createMemoMutation.mutate(
      { ...data, developmentId: development.id },
      {
        onSuccess: () => {
          nextFormKey();
        },
      }
    );
  };

  const handleToggleAllowOtherUserMemos = () => {
    toggleAllowOtherUserMemosMutation.mutate();
  };

  // メモスレッドが追加されたらスクロールさせる
  useAutoScrollOnIncrease({
    target: memoFormCardRef,
    count: developmentMemoThreads.length,
  });

  return (
    <>
      <PageHeader icon={MdComputer} pageName="開発情報の詳細" />
      <Stack maw={1200} w="100%" m="auto" gap={40}>
        <DevDetailCard
          development={development}
          onToggleDevelopmentLike={handleToggleDevelopmentLike}
          isDeveloper={isDeveloper}
        />
        <Stack gap="xl">
          <Flex align="center" justify="space-between" gap="xl">
            <Title order={4}>開発メモ</Title>
            {isDeveloper && (
              <Card>
                <Switch
                  checked={development.allowOtherUserMemos}
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
          {developmentMemoThreads.length === 0 ? (
            <Card py={40}>
              <Center h="100%">
                <EmptyContentItem
                  icon={<TbNote size={120} color={colors.gray[7]} />}
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
              {developmentMemoThreads.map((thread) => {
                return (
                  <DevMemoThreadCard
                    ideaId={idea.id}
                    key={thread.rootMemo.id}
                    memo={thread.rootMemo}
                    developmentId={development.id}
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
              developmentId={development.id}
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
