import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";
import { FaSearch } from "react-icons/fa";

export const HomePage: React.FC = () => {
  const { session } = useSessionQuery();

  const queryClient = useQueryClient();

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: () => {
      return trpc.themes.getAll.query();
    },
    initialData: [],
  });

  const deleteThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["themes"]["delete"]) => {
      return trpc.themes.delete.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["themes"]);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const handleDeleteTheme = (id: string) => {
    deleteThemeMutation.mutate({ themeId: id });
  };

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
          return (
            <Card shadow="sm" withBorder key={theme.id}>
              <Title>{theme.title}</Title>
              <Flex gap={5} wrap="wrap">
                {theme.tags.map((tag) => {
                  return (
                    <Badge sx={{ textTransform: "none" }} key={tag.id}>
                      {tag.name}
                    </Badge>
                  );
                })}
              </Flex>
              <Avatar src={theme.user.image} radius="xl" size="md" />
              <Text>{theme.user.name}</Text>
              <Text>{new Date(theme.createdAt).toLocaleString()}</Text>

              <Flex gap={5}>
                <Button component={Link} href={`/themes/${theme.id}`}>
                  詳細
                </Button>
                {session?.user.id === theme.user.id && (
                  <>
                    <Button
                      component={Link}
                      href={`/themes/${theme.id}/update`}
                      variant="outline"
                    >
                      更新
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteTheme(theme.id);
                      }}
                      variant="outline"
                    >
                      削除
                    </Button>
                  </>
                )}
              </Flex>
            </Card>
          );
        })}
      </Stack>
    </main>
  );
};
