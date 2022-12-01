import {
  Box,
  Button,
  Card,
  Flex,
  Pagination,
  Text,
  Title,
} from "@mantine/core";

import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { usePaginatedThemesQuery } from "../hooks/usePaginatedThemesQuery";
import { usePaginationState } from "../hooks/usePaginationState";
import { ThemeCard } from "./ThemeCard/ThemeCard";

export const HomePage: React.FC = () => {
  const [page, setPage] = usePaginationState();
  const { data } = usePaginatedThemesQuery(page);

  return (
    <Flex gap={30} justify="space-between">
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
          {data?.themes.map((theme) => {
            return <ThemeCard key={theme.id} theme={theme} />;
          })}
        </Flex>
        <Pagination
          mt="md"
          page={page}
          onChange={setPage}
          total={data?.allPages ?? 0}
        />
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
