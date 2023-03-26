import { Card, Flex, Text, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
export const EmptyPopularIdeas = () => {
  const { colors } = useMantineTheme();

  return (
    <Card bg="red.7" h={250} sx={{ overflow: "hidden" }}>
      <Flex align="center" justify="center">
        <Card h={220} w={400} sx={{ display: "flex", alignItems: "center" }}>
          <Flex m="auto" align="center" direction="column">
            <TbHeart size={80} color={colors.red[7]} />
            <Text mt="md" fz="xl" c="gray.5" align="center">
              お題へいいねしてみよう！
            </Text>
            <Text fz="sm" c="gray.4" align="center">
              人気のお題がここに表示されます。
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
};
