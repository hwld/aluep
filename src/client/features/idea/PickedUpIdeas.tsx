import {
  IdeaCard,
  ideaCardMinWidthPx,
} from "@/client/features/idea/IdeaCard/IdeaCard";
import { GridContainer } from "@/client/ui/GridContainer";
import { Idea } from "@/server/models/idea";
import { Button, Flex, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import { HiArrowRight } from "react-icons/hi";

type Props = {
  title: string;
  ideas: Idea[];
  readMoreHref: string;
  icon?: ReactNode;
};

export const PickedUpIdeas: React.FC<Props> = ({
  title,
  ideas,
  readMoreHref,
  icon,
}) => {
  return (
    <Stack spacing="sm">
      <Flex align="center" justify="space-between">
        <Flex align="center" sx={{ gap: "5px" }}>
          {icon}
          <Title order={4}>{title}</Title>
        </Flex>
        <Button
          rightIcon={<HiArrowRight size={15} />}
          component={Link}
          href={readMoreHref}
          variant="outline"
          sx={(theme) => ({
            "&:hover": {
              backgroundColor: theme.fn.rgba(theme.colors.red[4], 0.1),
            },
          })}
        >
          もっと見る
        </Button>
      </Flex>
      <GridContainer minItemWidthPx={ideaCardMinWidthPx}>
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </GridContainer>
    </Stack>
  );
};
