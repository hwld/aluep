import { Flex, Stack, Text } from "@mantine/core";
import {
  IconPointFilled,
  IconQuestionMark,
  IconUserSearch,
} from "@tabler/icons-react";

export const EmptyUserSearchResult: React.FC = () => {
  return (
    <Flex direction="column">
      <Flex justify="center" align="center">
        <IconUserSearch
          width={70}
          height={70}
          color="var(--mantine-color-red-7)"
        />
        <IconPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-3)"
        />
        <IconPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-4)"
        />
        <IconPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-5)"
        />
        <IconPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-6)"
        />
        <IconQuestionMark
          width={80}
          height={80}
          color="var(--mantine-color-red-7)"
        />
      </Flex>
      <Stack gap={0}>
        <Text ta="center" c="gray.5">
          ユーザがいません
        </Text>
        <Text ta="center" c="gray.5">
          別の条件をお試しください。
        </Text>
      </Stack>
    </Flex>
  );
};
