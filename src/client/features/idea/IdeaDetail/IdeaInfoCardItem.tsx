import { Box, Divider, Flex, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  disabledDivider?: boolean;
};

export const IdeaInfoCardItem: React.FC<Props> = ({
  icon,
  title,
  children,
  disabledDivider,
}) => {
  return (
    <Stack gap={0}>
      <Flex gap="xs" align="center">
        {icon}
        <Text c="gray.5" size="sm">
          {title}
        </Text>
      </Flex>
      <Box mt={5} ml="xs">
        {children}
      </Box>
      {!disabledDivider && <Divider my="xs" />}
    </Stack>
  );
};
