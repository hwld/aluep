import { Flex, Text, useMantineTheme } from "@mantine/core";
import { BsDot } from "react-icons/bs";
import { MdOutlinePersonSearch } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";

export const EmptyUserSearchResult: React.FC = () => {
  const { colors } = useMantineTheme();

  return (
    <Flex direction="column">
      <Flex justify="center" align="center">
        <MdOutlinePersonSearch size={70} color={colors.red[7]} />
        <BsDot size={40} color={colors.red[3]} />
        <BsDot size={40} color={colors.red[4]} />
        <BsDot size={40} color={colors.red[5]} />
        <BsDot size={40} color={colors.red[6]} />
        <RiQuestionMark size={80} color={colors.red[7]} />
      </Flex>
      <Text align="center" c="gray.5">
        ユーザがいません<br></br>
        <Text align="center" c="gray.5">
          別の条件をお試しください。
        </Text>
      </Text>
    </Flex>
  );
};
