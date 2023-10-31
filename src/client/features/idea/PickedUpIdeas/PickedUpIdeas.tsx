import {
  IdeaCard,
  ideaCardMinWidthPx,
} from "@/client/features/idea/IdeaCard/IdeaCard";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { Idea } from "@/models/idea";
import { Button, Flex, Stack, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode } from "react";
import classes from "./PickedUpIdeas.module.css";

type Props = {
  title: string;
  ideas: Idea[];
  readMoreHref?: string;
  icon?: ReactNode;
};

export const PickedUpIdeas: React.FC<Props> = ({
  title,
  ideas,
  readMoreHref,
  icon,
}) => {
  return (
    <Stack gap="sm">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap="5px">
          {icon}
          <Title order={4}>{title}</Title>
        </Flex>
        {readMoreHref && (
          <Button
            rightSection={<IconArrowRight width={20} height={20} />}
            component={Link}
            href={readMoreHref}
            variant="outline"
            className={classes["read-more"]}
          >
            もっと見る
          </Button>
        )}
      </Flex>
      <GridContainer minItemWidthPx={ideaCardMinWidthPx}>
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </GridContainer>
    </Stack>
  );
};
