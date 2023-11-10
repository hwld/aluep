import { Routes } from "@/share/routes";
import { Box, Button, Flex, Text, Title } from "@mantine/core";
import { IconTool } from "@tabler/icons-react";
import Link from "next/link";

export const ServerError: React.FC = () => {
  return (
    <>
      <Flex
        h="100%"
        align="center"
        pos="relative"
        style={(theme) => ({
          overflow: "hidden",
          margin: `calc(-1 * ${theme.spacing.sm})`,
        })}
      >
        <Flex
          align="center"
          direction="column"
          m="auto"
          style={{ zIndex: 2 }}
          pos="relative"
          inset={0}
          h="min-content"
        >
          <Box
            pos="absolute"
            opacity={0.1}
            style={{
              top: "-200px",
              right: "-350px",
            }}
          >
            <IconTool
              width={600}
              height={600}
              color="var(--mantine-color-red-7)"
            />
          </Box>
          <Title size={200} fw={900} style={{ lineHeight: "180px" }}>
            500
          </Title>
          <Text mt="lg" size="xl" fw={900} ta="center">
            サーバーでエラーが発生しました。
          </Text>
          <Text mt="sm" ta="center" fw="bold">
            サーバーの問題でページを表示することが出来ません。
            <br />
            恐れ入りますが、再度時間をおいてアクセスしてください。
          </Text>
          <Button mt={50} component={Link} href={Routes.home}>
            ホームへ戻る
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
