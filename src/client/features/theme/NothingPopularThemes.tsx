import { Card, Flex, Text, useMantineTheme } from "@mantine/core";
import { SlLike } from "react-icons/sl";
export const NothingPopularThemes = () => {
  const mantineTheme = useMantineTheme();
  return (
    <Card bg="red.7" h={250}>
      <Flex align={"center"} justify={"center"}>
        <Card h={220} w="50%">
          <Flex
            gap={20}
            justify={"center"}
            direction={"column"}
            sx={() => {
              return { margin: 30 };
            }}
          >
            <Flex gap={25} justify={"center"} align={"flex-end"}>
              <SlLike size={30} color={mantineTheme.colors.red[3]} />
              <SlLike size={35} color={mantineTheme.colors.red[4]} />
              <SlLike size={40} color={mantineTheme.colors.red[5]} />
              <SlLike size={45} color={mantineTheme.colors.red[6]} />
              <SlLike size={50} color={mantineTheme.colors.red[7]} />
            </Flex>
            <Text fz="xl" c="gray.5" align="center">
              お題へいいねしてみよう！
            </Text>
            <Text fz="xs" c={"gray.4"} align="center">
              人気のお題がここに表示されます。
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
};
