import { FunctionIcon } from "@/client/pageComponents/About/FunctionIcon";
import { Card, Group, Stack, Text } from "@mantine/core";
import classes from "./About.module.css";

type Props = { icon: React.FC; title: string; description: string };

export const FunctionCard: React.FC<Props> = ({ icon, title, description }) => {
  return (
    <Card>
      <Group wrap="nowrap">
        <FunctionIcon icon={icon} />
        <Stack className={classes["function-content"]}>
          <Text className={classes["function-title"]}>{title}</Text>
          <Text className={classes["function-desc"]}>{description}</Text>
        </Stack>
      </Group>
    </Card>
  );
};
