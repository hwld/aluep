import { IdeaCardIconCounter } from "@/client/features/idea/IdeaCardIconCounter/IdeaCardIconCounter";
import { IdeaTagBadge } from "@/client/features/idea/IdeaTagBadge/IdeaTagBadge";
import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Flex, Group, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { TbCode, TbHeart, TbMessageCircle } from "react-icons/tb";
import classes from "./IdeaCard.module.css";

export const ideaCardMinWidthPx = 450;

type Props = { idea: Idea };
export const IdeaCard: React.FC<Props> = ({ idea }) => {
  const router = useRouter();

  const handleGoIdeaDetail = () => {
    router.push(Routes.idea(idea.id));
  };

  return (
    <ItemCard
      miw={ideaCardMinWidthPx}
      className={classes.root}
      onClick={handleGoIdeaDetail}
      leftHeader={
        <TextLink href={Routes.idea(idea.id)} className={classes["idea-link"]}>
          <Title order={3} c="red.7" className={classes["idea-title"]}>
            {idea.title}
          </Title>
        </TextLink>
      }
      leftFooter={
        // タグ
        idea.tags.length > 0 && (
          <Flex gap={5} wrap="wrap" miw={0}>
            {idea.tags.map((tag) => {
              return (
                <IdeaTagBadge tagId={tag.id} size="md" key={tag.id}>
                  {tag.name}
                </IdeaTagBadge>
              );
            })}
          </Flex>
        )
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
            <Group gap="sm">
              <IdeaCardIconCounter icon={<TbHeart />} counter={idea.likes} />
              <IdeaCardIconCounter icon={<TbCode />} counter={idea.devs} />
              <IdeaCardIconCounter
                icon={<TbMessageCircle />}
                counter={idea.comments}
              />
            </Group>
          </Group>
        }
      />
    </ItemCard>
  );
};
