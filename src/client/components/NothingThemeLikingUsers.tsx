import { Flex, Text, useMantineTheme } from "@mantine/core";
import Image from "next/image";
import { MdOutlineFavoriteBorder } from "react-icons/md";
export const NothingThemeLikingUsers = () => {
  const mantineTheme = useMantineTheme();
  return (
    <Flex mt={30} direction={"column"} align={"center"} gap={15}>
      <Flex align={"flex-end"}>
        <Image src="/logo.svg" alt="logo" width={60} height={60} />
        <MdOutlineFavoriteBorder size={80} color={mantineTheme.colors.red[7]} />
      </Flex>
      <Text fz="xl" align="center">
        お題へいいねしてみよう！
      </Text>
      <Text fz="xs" c={"gray.4"} align="center">
        このお題にはまだいいねがされていません。
      </Text>
    </Flex>
  );
};
