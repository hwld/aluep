import { Box, Button, Card, Flex, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { trpc } from "../trpc";
import { ThemeCard } from "./ThemeCard/ThemeCard";

export const HomePage: React.FC = () => {
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: () => {
      return trpc.theme.getAll.query();
    },
    initialData: [],
  });

  return (
    <Flex gap={30}>
      <Box>
        <Title>アプリ開発のお題</Title>
        <Button
          leftIcon={<FaSearch />}
          component={Link}
          href="/themes/search"
          mt={10}
          sx={(theme) => ({ boxShadow: theme.shadows.lg })}
        >
          お題を検索する
        </Button>

        <Flex mt={30} gap={15} wrap="wrap">
          {themes.map((theme) => {
            return <ThemeCard key={theme.id} theme={theme} />;
          })}
        </Flex>
      </Box>
      <Flex direction="column" gap={30}>
        <Box>
          <Text fw="bold">ランキング1</Text>
          <Card mt={10} w={300} h={500} sx={{ flexShrink: 0 }}>
            {""}
          </Card>
        </Box>
        <Box>
          <Text fw="bold">ランキング2</Text>
          <Card mt={10} w={300} h={500} sx={{ flexShrink: 0 }}>
            {""}
          </Card>
        </Box>
      </Flex>
    </Flex>
  );
};
