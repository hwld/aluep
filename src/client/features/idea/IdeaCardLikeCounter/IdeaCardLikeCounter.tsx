import { Idea } from "@/models/idea";
import { Flex, MantineStyleProp, Text } from "@mantine/core";
import { TbHeart } from "react-icons/tb";

type Props = { idea: Idea };

export const IdeaCardLikeCounter: React.FC<Props> = ({ idea }) => {
  const style: MantineStyleProp = idea.likedByLoggedInUser
    ? {
        borderBottom: "2px solid var(--mantine-color-red-5)",
        backgroundColor: "var(--mantine-color-red-1)",
      }
    : { borderBottom: "2px solid transparent" };

  return (
    <Flex align="center" gap={5} style={style}>
      <TbHeart
        size="55px"
        color="transparent"
        fill="var(--mantine-color-red-7)"
      />
      <Text
        size="xl"
        fw="bold"
        c="red.7"
        style={{ fontSize: "25px", whiteSpace: "nowrap" }}
      >
        {idea.likes}
      </Text>
    </Flex>
  );
};
