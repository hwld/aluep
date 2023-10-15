import { MutedText } from "@/client/ui/MutedText/MutedText";
import { Box, Divider, Flex, Stack } from "@mantine/core";
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
        <MutedText>{title}</MutedText>
      </Flex>
      <Box mt={5} ml="xs">
        {children}
      </Box>
      {!disabledDivider && <Divider my="xs" />}
    </Stack>
  );
};
