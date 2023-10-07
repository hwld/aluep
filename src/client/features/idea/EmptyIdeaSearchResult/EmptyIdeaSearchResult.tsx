import { Card, Flex, Text, useMantineTheme } from "@mantine/core";
import { BsDot } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { RiQuestionMark } from "react-icons/ri";
import classes from "./EmptyIdeaSearchResult.module.css";

export const EmptyIdeaSearchResult = () => {
  const { colors } = useMantineTheme();

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
          <GoSearch size={70} color={colors.red[7]} />
          <BsDot size={40} color={colors.red[3]} />
          <BsDot size={40} color={colors.red[4]} />
          <BsDot size={40} color={colors.red[5]} />
          <BsDot size={40} color={colors.red[6]} />
          <RiQuestionMark size={80} color={colors.red[7]} />
        </Flex>
        <Text mt="md" c="gray.5" ta="center">
          条件に一致する検索結果はありません。<br></br>
          別の条件をお試しください。
        </Text>
      </Card>
    </Flex>
  );
};