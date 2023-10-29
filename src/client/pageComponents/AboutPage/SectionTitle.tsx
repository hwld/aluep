import { Box, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import classes from "./AboutPage.module.css";

type Props = { number: number; title: string; subTitle: string };
export const SectionTitle: React.FC<Props> = ({ number, title, subTitle }) => {
  return (
    <Stack gap={0}>
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
