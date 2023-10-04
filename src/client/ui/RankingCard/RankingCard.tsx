import { Card, Stack, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import classes from "./RankingCard.module.css";

type Props = { title: string } & PropsWithChildren;
export const RankingCard: React.FC<Props> = ({ title, children }) => {
  return (
    <Card p={0} w={300} withBorder className={classes.root}>
      <Card.Section bg="red" py="xs" m={0}>
        <Text c="gray.0" ta="center">
          {title}
        </Text>
      </Card.Section>
      <Stack gap="sm" p="md">
        {children}
      </Stack>
    </Card>
  );
};
