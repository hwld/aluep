import { Card, Group, Stack, Title } from "@mantine/core";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import classes from "./AboutPage.module.css";

type Props = {
  usecase: { icon: IconType; name: string };
  flow: ReactNode;
  functions: ReactNode;
};
export const UsecaseSection: React.FC<Props> = ({
  usecase: { icon: Icon, name },
  flow,
  functions,
}) => {
  return (
    <Stack className={classes["usecase-root"]}>
      <Stack className={classes["usecase-title-wrapper"]}>
        <Group className={classes["usecase-title-group"]}>
          <Icon className={classes["usecase-title-icon"]} />
          <Title order={4} className={classes["usecase-title"]}>
            {name}
          </Title>
          <Icon className={classes["usecase-title-icon"]} />
        </Group>
      </Stack>

      <Card className={classes["usecase-flow"]}>
        <Group className={classes["usecase-flow-group"]}>{flow}</Group>
      </Card>
      <Stack className={classes["usecase-functions"]}>{functions}</Stack>
    </Stack>
  );
};
