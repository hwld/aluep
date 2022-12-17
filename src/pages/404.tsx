import { Box, Button, Flex, Text, Title, useMantineTheme } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { MdOutlineErrorOutline } from "react-icons/md";

const NotFoundPage: NextPage = () => {
  const theme = useMantineTheme();

  return (
    <>
      <Flex h="100%" align="center" pos="relative">
        <Box pos="absolute" opacity={0.1} right={0} top={50} bottom={0}>
          <MdOutlineErrorOutline size={600} color={theme.colors.red[7]} />
        </Box>
        <Flex
          align="center"
          direction="column"
          m="auto"
          sx={{ zIndex: 2 }}
          pos="fixed"
          inset={0}
          h="min-content"
        >
          <Title size={200} fw={900} sx={{ lineHeight: "180px" }}>
            404
          </Title>
          <Text mt="lg" size={35} fw={900} align="center">
            ページが見つかりませんでした。
          </Text>
          <Text mt="sm" align="center" fw="bold">
            お探しのページはすでに削除されているか、URLが間違っている可能性があります。
          </Text>
          <Button mt={50} component={Link} href="/">
            ホームへ戻る
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
export default NotFoundPage;
