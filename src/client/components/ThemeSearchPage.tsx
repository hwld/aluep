import { Box, Card, Flex, Pagination, Stack, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React from "react";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { usePaginationState } from "../hooks/usePaginationState";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { useStateAndUrlParamString } from "../hooks/useStateAndUrlParamString";
import { useStateAndUrlParamStringArray } from "../hooks/useStateAndUrlParamStringArray";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextInput } from "./AppTextInput";
import { ThemeCard } from "./ThemeCard/ThemeCard";

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [page, setPage] = usePaginationState({});

  const [keyword, setKeyword] = useStateAndUrlParamString({
    paramName: "keyword",
    initialData: "",
  });
  // keywordが変更されてから200ms後に変更される
  const [debouncedKeyword] = useDebouncedValue(keyword, 200);

  const [tagIds, setTagIds] = useStateAndUrlParamStringArray({
    paramName: "tagIds",
    initialData: [],
  });

  const { searchedThemesResult } = useSearchedThemesQuery({
    keyword: debouncedKeyword,
    tagIds,
    page,
  });

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const handleChangeTagIds = (values: string[]) => {
    setTagIds(values);
  };

  return (
    <Box p={30}>
      <Flex w="100%" direction="column">
        <Card
          maw="756px"
          sx={() => ({
            position: "static",
          })}
        >
          <Stack spacing="sm">
            <Title order={4}>検索</Title>
            <AppTextInput
              label="キーワード"
              value={keyword}
              onChange={handleChangeKeyword}
            />

            <AppMultiSelect
              label="タグ"
              data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
              value={tagIds}
              onChange={handleChangeTagIds}
              searchable
            />
          </Stack>
          <Text size="sm" mt={10}>
            ※指定されたタグをすべて含み、指定されたキーワードがお題のタイトルに含まれるお題を検索する。
          </Text>
        </Card>
        <Box mt={30}>
          <Title order={3}>検索結果</Title>
          <Flex mt={10} gap="md" wrap="wrap">
            {searchedThemesResult?.themes.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </Box>
        <Pagination
          page={page}
          onChange={setPage}
          total={searchedThemesResult?.allPages ?? 0}
          mt="md"
        />
      </Flex>
    </Box>
  );
};
