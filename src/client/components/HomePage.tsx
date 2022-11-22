import { Button, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { trpc } from "../trpc";
import { AppThemeCard } from "./AppThemeCard";

export const HomePage: React.FC = () => {
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: () => {
      return trpc.theme.getAll.query();
    },
    initialData: [],
  });

  return (
    <main>
      <Title>アプリ開発のお題</Title>
      <Button
        leftIcon={<FaSearch />}
        component={Link}
        href="/themes/search"
        mt={10}
      >
        お題を検索する
      </Button>

      <Stack mt={30}>
        {themes.map((theme) => {
          return <AppThemeCard key={theme.id} theme={theme} />;
        })}
      </Stack>
    </main>
  );
};
