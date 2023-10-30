import { SvgPointFilled, SvgQuestionMark, SvgSearch } from "@/client/ui/Icons";
import { Card, Flex, Text } from "@mantine/core";
import classes from "./EmptyIdeaSearchResult.module.css";

export const EmptyIdeaSearchResult = () => {
  return (
    <Flex
      align="center"
      direction="column"
      gap={30}
      bg="gray.3"
      p="md"
      className={classes.root}
    >
      <Card w={450} p="xl">
        <Flex justify="center" align="center">
          <SvgSearch
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
            width={90}
            height={90}
            color="var(--mantine-color-red-7)"
          />
        </Flex>
        <Text mt="md" c="gray.5" ta="center">
          条件に一致する検索結果はありません。<br></br>
          別の条件をお試しください。
        </Text>
      </Card>
    </Flex>
  );
};
