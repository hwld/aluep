import { Box, Button, Flex, Text, Title, useMantineTheme } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { BiWrench } from "react-icons/bi";

const ServerErrorPage: NextPage = () => {
  const theme = useMantineTheme();

  return (
    <>
      <Flex h="100%" align="center" pos="relative">
        <Flex
          align="center"
          direction="column"
          m="auto"
          sx={{ zIndex: 2 }}
          pos="relative"
          inset={0}
          h="min-content"
        >
          <Box
            pos="absolute"
            opacity={0.1}
            sx={{
              top: "-200px",
              right: "-350px",
            }}
          >
            <BiWrench size={600} color={theme.colors.red[7]} />
          </Box>
          <Title size={200} fw={900} sx={{ lineHeight: "180px" }}>
            500
          </Title>
          <Text mt="lg" size={35} fw={900} align="center">
            サーバーでエラーが発生しました。
          </Text>
          <Text mt="sm" align="center" fw="bold">
            サーバーの問題でページを表示することが出来ません。
            <br />
            恐れ入りますが、再度時間をおいてアクセスしてください。
          </Text>
          <Button mt={50} component={Link} href="/">
            ホームへ戻る
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
export default ServerErrorPage;
