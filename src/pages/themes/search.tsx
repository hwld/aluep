import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../client/trpc";
import { prisma } from "../../server/prismadb";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const allTags = await prisma.appThemeTag.findMany();

  return {
    props: {
      allTags: allTags.map(({ id, name }) => ({ id, name })),
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SearchTheme: NextPage<PageProps> = ({ allTags }) => {
  const [keyword, setKeyword] = useState("");
  // keywordが変更されてから500ms後に変更される
  const [debouncedKeyword] = useDebouncedValue(keyword, 500);
  const [tags, setTags] = useState<string[]>([]);
  const result = useQuery({
    // keyword,tagsが変更されたときに自動で検索がかかる。
    // これをやりたくなかったら、queryClient.invalidateQueriesを使用する？
    queryKey: ["themes", { debouncedKeyword, tags }] as const,
    queryFn: ({ queryKey }) => {
      const { debouncedKeyword, tags } = queryKey[1];
      return trpc.themes.search.query({
        keyword: debouncedKeyword,
        tagIds: tags,
      });
    },
  });

  return (
    <Box p={30}>
      <Flex w="100%" direction="column">
        <Card
          shadow="sm"
          withBorder
          sx={{ position: "static", maxWidth: "756px", width: "100%" }}
        >
          <Stack spacing="sm">
            <Title order={2}>検索</Title>
            <TextInput
              label="キーワード"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <MultiSelect
              label="タグ"
              data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
              value={tags}
              onChange={setTags}
            />
          </Stack>
          <Text size="sm" mt={10}>
            ※指定されたタグをすべて含み、指定されたキーワードがお題のタイトル、説明の少なくとも一方に含まれるお題を検索
          </Text>
        </Card>
        <Box mt={30}>
          <Title order={2}>検索結果</Title>
          <Stack mt={10}>
            {result.data?.map((theme) => {
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
                  <Button component={Link} href={`/themes/${theme.id}`}>
                    詳細
                  </Button>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default SearchTheme;
