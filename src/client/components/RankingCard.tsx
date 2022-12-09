import { Card, Stack, Text } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = { title: string } & PropsWithChildren;
export const RankingCard: React.FC<Props> = ({ title, children }) => {
  return (
    <Card
      p="sm"
      mt={10}
      w={300}
      withBorder
      sx={(theme) => ({
        flexShrink: 0,
        borderColor: theme.colors.red[7],
        borderWidth: "2px",
      })}
    >
      <Card.Section bg="red" py="xs">
        <Text color="gray.0" align="center">
          {title}
        </Text>
      </Card.Section>
      <Stack spacing="sm" mt="md">
        {children}
      </Stack>
    </Card>
  );
};
