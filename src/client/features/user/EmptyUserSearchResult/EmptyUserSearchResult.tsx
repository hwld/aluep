import { Flex, Stack, Text } from "@mantine/core";
import { BsDot } from "react-icons/bs";
import { MdOutlinePersonSearch } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";

export const EmptyUserSearchResult: React.FC = () => {
  return (
    <Flex direction="column">
      <Flex justify="center" align="center">
        <MdOutlinePersonSearch size={70} color="var(--mantine-color-red-7)" />
        <BsDot size={40} color="var(--mantine-color-red-3)" />
        <BsDot size={40} color="var(--mantine-color-red-4)" />
        <BsDot size={40} color="var(--mantine-color-red-5)" />
        <BsDot size={40} color="var(--mantine-color-red-6)" />
        <RiQuestionMark size={80} color="var(--mantine-color-red-7)" />
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
