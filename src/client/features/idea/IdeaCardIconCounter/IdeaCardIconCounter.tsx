import { Flex, Text } from "@mantine/core";
import { ReactNode } from "react";
import classes from "./IdeaCardIconCounter.module.css";

type Props = { icon: ReactNode; counter: number };

export const IdeaCardIconCounter: React.FC<Props> = ({ icon, counter }) => {
  return (
    <Flex align="center" gap={3} className={classes.root}>
      {icon}
      <Text size="xs" c="red.7">
        {counter}
      </Text>
    </Flex>
  );
};
