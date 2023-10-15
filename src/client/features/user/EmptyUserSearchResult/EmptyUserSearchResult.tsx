import { Flex, Stack, Text } from "@mantine/core";
import { TbPointFilled, TbQuestionMark, TbUserSearch } from "react-icons/tb";

export const EmptyUserSearchResult: React.FC = () => {
  return (
    <Flex direction="column">
      <Flex justify="center" align="center">
        <TbUserSearch size={70} color="var(--mantine-color-red-7)" />
        <TbPointFilled size={30} color="var(--mantine-color-red-3)" />
        <TbPointFilled size={30} color="var(--mantine-color-red-4)" />
        <TbPointFilled size={30} color="var(--mantine-color-red-5)" />
        <TbPointFilled size={30} color="var(--mantine-color-red-6)" />
        <TbQuestionMark size={80} color="var(--mantine-color-red-7)" />
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
