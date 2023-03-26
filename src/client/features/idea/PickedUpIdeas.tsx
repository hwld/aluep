import { Button, Flex, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import { HiArrowRight } from "react-icons/hi";
import { Idea } from "../../../server/models/idea";
import { useSessionQuery } from "../session/useSessionQuery";
import { IdeaCardContainer } from "./IdeaCardContainer";

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
  const { session } = useSessionQuery();
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
        >
          もっと見る
        </Button>
      </Flex>
      <IdeaCardContainer ideas={ideas ?? []} />
    </Stack>
  );
};
