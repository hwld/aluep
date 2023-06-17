import { Grid } from "@mantine/core";
import React from "react";
import { MdComputer } from "react-icons/md";
import { Development } from "../../server/models/development";
import { Idea } from "../../server/models/idea";
import { DeveloperCard } from "../features/development/DeveloperCard";
import { DevelopmentDetailCard } from "../features/development/DevelopmentDetailCard";
import { useDevelopmentLikeOnDetail } from "../features/development/useDevelopmentLikeOnDetail";
import { useRequireLoginModal } from "../features/session/RequireLoginModalProvider";
import { useSessionQuery } from "../features/session/useSessionQuery";
import { PageHeader } from "../ui/PageHeader";

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
    <>
      <PageHeader icon={MdComputer} pageName="開発情報の詳細" />
      <Grid maw={1200} w="100%" m="auto">
        <Grid.Col xs={12} md={7}>
          <DevelopmentDetailCard
            development={development}
            onToggleDevelopmentLike={handleToggleDevelopmentLike}
            isLoggedInUserDeveloper={isLoggedInUserDeveloper}
          />
        </Grid.Col>
        <Grid.Col xs={12} md={5}>
          <DeveloperCard
            development={development}
            isLoggedInUserDeveloper={isLoggedInUserDeveloper}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};
