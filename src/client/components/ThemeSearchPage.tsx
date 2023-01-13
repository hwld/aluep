import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React from "react";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { ThemeOrder } from "../../share/schema";
import { usePaginationState } from "../hooks/usePaginationState";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { useStateAndUrlParamString } from "../hooks/useStateAndUrlParamString";
import { useStateAndUrlParamStringArray } from "../hooks/useStateAndUrlParamStringArray";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppPagination } from "./AppPagination";
import { AppSelect } from "./AppSelect";
import { AppTextInput } from "./AppTextInput";
import { NothingTheme } from "./NothingTheme";
import { ThemeCardContainer } from "./ThemeCardContainer";

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

  const [order, setOrder] = useStateAndUrlParamString({
    paramName: "order",
    initialData: "createdDesc" satisfies ThemeOrder,
  });

  const { searchedThemesResult } = useSearchedThemesQuery({
    keyword: debouncedKeyword,
    tagIds,
    order,
    page,
  });

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const handleChangeTagIds = (values: string[]) => {
    setTagIds(values);
  };

  const orderItems: { value: ThemeOrder; label: string }[] = [
    { value: "createdDesc", label: "新しい順" },
    { value: "createdAsc", label: "古い順" },
    { value: "likeDesc", label: "いいねが多い順" },
    { value: "developerDesc", label: "開発者が多い順" },
  ];

  return (
    <Box>
      <Flex w="100%" direction="column">
        <Card
          sx={() => ({
            position: "static",
          })}
        >
          <Stack spacing="sm">
            <Title order={5}>検索</Title>
            <Box
              sx={(theme) => ({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                  gridTemplateColumns: "1fr",
                  gap: 10,
                },
              })}
            >
              <AppTextInput
                label="キーワード"
                value={keyword}
                onChange={handleChangeKeyword}
              />

              <AppMultiSelect
                label="タグ"
                data={allTags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                value={tagIds}
                onChange={handleChangeTagIds}
                searchable
              />
            </Box>
            <AppSelect
              label="並び順"
              value={order}
              onChange={setOrder}
              data={orderItems}
            />
          </Stack>
          <Text size="sm" c="gray.4" mt={20}>
            ※指定されたタグをすべて含み、指定されたキーワードがお題のタイトルに含まれるお題を検索します。
          </Text>
        </Card>
        <Stack mt={30}>
          <Title order={4}>検索結果</Title>
          {keyword === "" && tagIds.length === 0 ? (
            <NothingTheme page="initial" />
          ) : searchedThemesResult?.themes.length === 0 ? (
            <NothingTheme page="Search" />
          ) : (
            <ThemeCardContainer themes={searchedThemesResult?.themes ?? []} />
          )}
        </Stack>
        <AppPagination
          page={page}
          onChange={setPage}
          total={searchedThemesResult?.allPages ?? 0}
          mt="md"
        />
      </Flex>
    </Box>
  );
};
