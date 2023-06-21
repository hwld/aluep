import { Flex, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";

type Props = { icon: ReactNode; text: string; description: ReactNode };
export const EmptyContentItem: React.FC<Props> = ({
  icon,
  text,
  description,
}) => {
  return (
    <Stack align="flex-start" spacing={0}>
      <Flex direction="column" align="center">
        {icon}
        <Text size="lg" color="gray.5" fw="bold" mt="sm">
          {text}
        </Text>
        <Text align="center" color="gray.4" mt={5}>
          {description}
        </Text>
      </Flex>
    </Stack>
  );
};
