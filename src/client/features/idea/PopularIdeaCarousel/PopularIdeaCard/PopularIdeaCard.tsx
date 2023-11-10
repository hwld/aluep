import { IdeaCardLikeCounter } from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCard/IdeaCardLikeCounter/IdeaCardLikeCounter";
import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { useSamePositionLeftClick } from "@/client/lib/useSamePositionLeftClick";
import { IconCounter } from "@/client/ui/IconCounter/IconCounter";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Group, Text, Title } from "@mantine/core";
import { IconCode, IconMessageCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import classes from "./PopularIdeaCard.module.css";

export const popularIdeaCardWidthPx = 400;
export const PopularIdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
  const router = useRouter();

  // ただのクリックで処理するとカルーセルの移動で発火してしまうので
  // mouseDownと同じ位置でmouseUpが発火されたときに処理する
  const { setLeftClickPosition, isSameLeftClickPosition, resetPosition } =
    useSamePositionLeftClick();

  const handleMouseUp: MouseEventHandler = (e) => {
    if (isSameLeftClickPosition(e)) {
      resetPosition();
      router.push(Routes.idea(idea.id));
    }
    resetPosition();
  };

  return (
    <ItemCard
      h="100%"
      miw={popularIdeaCardWidthPx}
      className={classes.root}
      onMouseDown={setLeftClickPosition}
      onMouseUp={handleMouseUp}
      onMouseLeave={resetPosition}
      leftHeader={
        <TextLink href={Routes.idea(idea.id)} className={classes["idea-link"]}>
          <Title
            order={4}
            c="red.7"
            style={{ lineHeight: 1.2, wordBreak: "break-all" }}
          >
            {idea.title}
          </Title>
        </TextLink>
      }
      leftFooter={
        <UserSection
          userIconSrc={idea.user.image}
          userId={idea.user.id}
          title={
            <TextLink href={Routes.user(idea.user.id)}>
              <Text size="xs" truncate pb="1px">
                {idea.user.name}
              </Text>
            </TextLink>
          }
          content={
            <Group align="center" gap="md">
              <MutedText size="xs" style={{ whiteSpace: "nowrap" }}>
                {idea.elapsedSinceCreation}
              </MutedText>
              <Group align="center" gap="sm">
                <IconCounter
                  active={Boolean(idea.loggedInUserDevId)}
                  icon={<IconCode />}
                  counter={idea.devs}
                />
                <IconCounter
                  icon={<IconMessageCircle />}
                  counter={idea.comments}
                />
              </Group>
            </Group>
          }
        />
      }
      rightFooter={<IdeaCardLikeCounter idea={idea} />}
    />
  );
};
