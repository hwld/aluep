import { Flex, Stack, Switch, Title } from "@mantine/core";
import React from "react";
import { MdComputer } from "react-icons/md";
import { Development } from "../../server/models/development";
import { Idea } from "../../server/models/idea";
import { DevelopmentMemoFormData } from "../../share/schema";
import { DevelopmentDetailCard } from "../features/development/DevelopmentDetailCard";
import { useDevelopmentLikeOnDetail } from "../features/development/useDevelopmentLikeOnDetail";
import { DevelopmentMemoCard } from "../features/developmentMemo/DevelopmentMemoCard";
import { DevelopmentMemoFormCard } from "../features/developmentMemo/DevelopmentMemoFormCard";
import { useDevelopmentMemos } from "../features/developmentMemo/useDevelopmentMemos";
import { useRequireLoginModal } from "../features/session/RequireLoginModalProvider";
import { useSessionQuery } from "../features/session/useSessionQuery";
import { useCyclicRandom } from "../lib/useCyclicRandom";
import { PageHeader } from "../ui/PageHeader";

type Props = { development: Development; idea: Idea };

export const DevelopmentDetailPage: React.FC<Props> = ({ development }) => {
  const { session } = useSessionQuery();
  const loggedInUser = session?.user;
  const isLoggedInUserDeveloper =
    development.developerUserId === loggedInUser?.id;
  const { developmentMemos, createMemoMutation, deleteMemoMutation } =
    useDevelopmentMemos({
      developmentId: development.id,
    });
  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useDevelopmentLikeOnDetail(development.id);
  const { openLoginModal } = useRequireLoginModal();
  const { random: formKey, nextRandom: nextFormKey } = useCyclicRandom();

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
    createMemoMutation.mutate(data, {
      onSuccess: () => {
        nextFormKey();
      },
    });
  };

  const handleDeleteMemo = (id: string) => {
    deleteMemoMutation.mutate({ developmentMemoId: id });
  };

  return (
    <>
      <PageHeader icon={MdComputer} pageName="開発情報の詳細" />
      <Stack maw={1200} w="100%" m="auto" spacing={40}>
        <DevelopmentDetailCard
          development={development}
          onToggleDevelopmentLike={handleToggleDevelopmentLike}
          isLoggedInUserDeveloper={isLoggedInUserDeveloper}
        />
        <Stack spacing="xl">
          <Flex align="center" gap="xl">
            <Title order={4}>開発メモ</Title>
            <Switch label="他のユーザーのコメントを許可" />
          </Flex>
          <Stack spacing="xs">
            {developmentMemos?.map((memo) => {
              return (
                <DevelopmentMemoCard
                  key={memo.id}
                  memo={memo}
                  developmentId={development.id}
                  // TODO
                  childrenMemos={[memo, memo, memo, memo]}
                  onSubmitMemo={handleSubmitMemo}
                  isSubmittingMemo={createMemoMutation.isLoading}
                  onDeleteMemo={handleDeleteMemo}
                />
              );
            })}
          </Stack>
          {loggedInUser && (
            <DevelopmentMemoFormCard
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
