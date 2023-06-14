import { Stack, Text } from "@mantine/core";
import { ReactNode } from "react";

type Props = { icon: ReactNode; text: string };
export const EmptyUserContentItem: React.FC<Props> = ({ icon, text }) => {
  return (
    <Stack align="flex-start" spacing={0}>
      {icon}
      <Text size="xl" color="gray.5">
        {text}
      </Text>
    </Stack>
  );
};
