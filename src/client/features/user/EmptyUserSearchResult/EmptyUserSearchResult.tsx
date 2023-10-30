import {
  SvgPointFilled,
  SvgQuestionMark,
  SvgUserSearch,
} from "@/client/ui/Icons";
import { Flex, Stack, Text } from "@mantine/core";

export const EmptyUserSearchResult: React.FC = () => {
  return (
    <Flex direction="column">
      <Flex justify="center" align="center">
        <SvgUserSearch
          width={70}
          height={70}
          color="var(--mantine-color-red-7)"
        />
        <SvgPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-3)"
        />
        <SvgPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-4)"
        />
        <SvgPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-5)"
        />
        <SvgPointFilled
          width={30}
          height={30}
          color="var(--mantine-color-red-6)"
        />
        <SvgQuestionMark
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
