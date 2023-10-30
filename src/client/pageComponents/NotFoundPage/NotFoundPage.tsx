import { SvgExclamationCircle } from "@/client/ui/Icons";
import { Routes } from "@/share/routes";
import { Box, Button, Flex, Text, Title } from "@mantine/core";
import Link from "next/link";

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Flex
        h="100%"
        align="center"
        pos="relative"
        // AppLayoutのpaddingとここのmarginを合わせる
        style={(theme) => ({
          overflow: "hidden",
          margin: `-${theme.spacing.xl}px`,
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
            <SvgExclamationCircle
              width={600}
              height={600}
              color="var(--mantine-color-red-7)"
            />
          </Box>
          <Title size={200} fw={900} style={{ lineHeight: "180px" }}>
            404
          </Title>
          <Text mt="lg" size="xl" fw={900} ta="center">
            ページが見つかりませんでした。
          </Text>
          <Text mt="sm" ta="center" fw="bold">
            お探しのページはすでに削除されているか、URLが間違っている可能性があります。
          </Text>
          <Button mt={50} component={Link} href={Routes.home}>
            ホームへ戻る
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
