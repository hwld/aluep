import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { IconCounter } from "@/client/ui/IconCounter/IconCounter";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Group, Text, Title } from "@mantine/core";
import { IconCode, IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import classes from "./IdeaCard.module.css";

export const ideaCardMinWidthPx = 450;
export const ideaCardHeightPx = 160;

type Props = { idea: Idea };
export const IdeaCard: React.FC<Props> = ({ idea }) => {
  const router = useRouter();

  const handleGoIdeaDetail = () => {
    router.push(Routes.idea(idea.id));
  };

  return (
    <ItemCard
      miw={ideaCardMinWidthPx}
      h={ideaCardHeightPx}
      className={classes.root}
      onClick={handleGoIdeaDetail}
      leftHeader={
        <TextLink href={Routes.idea(idea.id)} className={classes["idea-link"]}>
          <Title order={3} c="red.7" className={classes["idea-title"]}>
            {idea.title}
          </Title>
        </TextLink>
      }
    >
      <UserSection
        userIconSrc={idea.user.image}
        userId={idea.user.id}
        title={
          <TextLink href={Routes.user(idea.user.id)}>
            <Text size="sm" truncate>
              {idea.user.name}
            </Text>
          </TextLink>
        }
        content={
          <Group gap="lg">
            <MutedText style={{ whiteSpace: "nowrap" }}>
              {idea.elapsedSinceCreation}
            </MutedText>
            <Group gap="sm" align="center">
              <IconCounter
                active={idea.likedByLoggedInUser}
                icon={<IconHeart />}
                counter={idea.likes}
              />
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
    </ItemCard>
  );
};
