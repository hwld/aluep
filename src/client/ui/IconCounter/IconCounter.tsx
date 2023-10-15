import { Flex, MantineStyleProp, Text, TextProps } from "@mantine/core";
import { ReactNode } from "react";
import classes from "./IconCounter.module.css";

type Props = {
  icon: ReactNode;
  counter: number;
  active?: boolean;
  counterProps?: TextProps;
};

export const IconCounter: React.FC<Props> = ({
  icon,
  counter,
  counterProps,
  active,
}) => {
  const style: MantineStyleProp = active
    ? {
        borderBottom: "1px solid var(--mantine-color-red-7)",
        backgroundColor: "var(--mantine-color-red-1)",
      }
    : { borderBottom: "1px solid transparent" };

  return (
    <Flex align="center" gap={3} className={classes.root} style={style}>
      {icon}
      <Text size="xs" c="red.7" {...counterProps}>
        {counter}
      </Text>
    </Flex>
  );
};
