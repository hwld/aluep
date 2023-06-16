import { Box, Flex, Stack } from "@mantine/core";
import React from "react";
import { Development } from "../../server/models/development";
import { Idea } from "../../server/models/idea";
import { DeveloperCard } from "../features/development/DeveloperCard";
import { DevelopmentDetailCard } from "../features/development/DevelopmentDetailCard";
import { useDevelopmentLikeOnDetail } from "../features/development/useDevelopLikeOnDetail";
import { useRequireLoginModal } from "../features/session/RequireLoginModalProvider";
import { useSessionQuery } from "../features/session/useSessionQuery";

type Props = { development: Development; idea: Idea };

export const DevelopmentDetailPage: React.FC<Props> = ({ development }) => {
  const { session } = useSessionQuery();
  const isLoggedInUserDeveloper =
    development.developerUserId === session?.user.id;
  const { likeDevelopmentMutation, unlikeDevelopmentMutation } =
    useDevelopmentLikeOnDetail(development.id);
  const { openLoginModal } = useRequireLoginModal();

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

  return (
    // TODO:
    // ipadの768pxには対応したい
    // 狭くなったら2行にしたい
    <Stack maw={1200} w="100%" m="auto" spacing="lg">
      <Flex w="100%" gap="md">
        <Box miw={350} sx={() => ({ flexGrow: 1, flexShrink: 1 })}>
          <DevelopmentDetailCard
            development={development}
            onToggleDevelopmentLike={handleToggleDevelopmentLike}
            isLoggedInUserDeveloper={isLoggedInUserDeveloper}
          />
        </Box>
        <Box w={500} miw={350} sx={() => ({ flexShrink: 1 })}>
          <DeveloperCard
            development={development}
            isLoggedInUserDeveloper={isLoggedInUserDeveloper}
          />
        </Box>
      </Flex>
    </Stack>
  );
};
