import { Box, Group, Stack, Text, Title } from "@mantine/core";
import clsx from "clsx";
import React from "react";
import classes from "./AboutPage.module.css";

type Props = {
  number: number;
  title: string;
  subTitle: string;
  dark?: boolean;
};
export const SectionTitle: React.FC<Props> = ({
  number,
  title,
  subTitle,
  dark,
}) => {
  return (
    <Stack gap={0} className={clsx({ [classes.dark]: dark })}>
      <Text className={classes["section-number"]}>
        {String(number).padStart(2, "0")}.
      </Text>
      <Group className={classes["section-title-wrapper"]}>
        <Box className={classes["section-title-decoration"]} />
        <Stack gap={0}>
          <Title order={3} className={classes["section-title"]}>
            {title}
          </Title>
          <Text className={classes["section-sub-title"]}>{subTitle}</Text>
        </Stack>
      </Group>
    </Stack>
  );
};
