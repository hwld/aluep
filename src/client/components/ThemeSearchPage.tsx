import { Box, Card, Flex, Space, Stack, Title } from "@mantine/core";
import React from "react";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { ThemeOrder } from "../../share/schema";
import { themeOrderItems } from "../consts";
import { usePaginationState } from "../hooks/usePaginationState";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { useStateAndUrlParamString } from "../hooks/useStateAndUrlParamString";
import { useStateAndUrlParamStringArray } from "../hooks/useStateAndUrlParamStringArray";
import { AppPagination } from "./AppPagination";
import { AppSelect } from "./AppSelect";
import { NothingTheme } from "./NothingTheme";
import { ThemeCardContainer } from "./ThemeCardContainer";
import { ThemeSearchForm, ThemeSearchParams } from "./ThemeSearchForm";

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();
  const [page, setPage] = usePaginationState({});

  const [keyword, setKeyword] = useStateAndUrlParamString({
    paramName: "keyword",
    initialData: "",
  });

  const [tagIds, setTagIds] = useStateAndUrlParamStringArray({
    paramName: "tagIds",
    initialData: [],
  });

  const [order, setOrder] = useStateAndUrlParamString({
    paramName: "order",
    initialData: "createdDesc" satisfies ThemeOrder,
  });

  const { searchedThemesResult } = useSearchedThemesQuery({
    keyword,
    tagIds,
    order,
    page,
  });

  const handleChangeOrder = async (value: string) => {
    await setOrder(value);
    await setPage(1);
  };

  const handleSearch = async (param: ThemeSearchParams) => {
    await setKeyword(param.keyword);
    await setTagIds(param.tagIds);
    await setPage(1);
  };

  return (
    <Box>
      <Flex w="100%" direction="column">
        <Card
          sx={() => ({
            position: "static",
          })}
        >
          <ThemeSearchForm
            allTags={allTags}
            defaultValues={{ keyword, tagIds }}
            onSearch={handleSearch}
          />
        </Card>
        <Stack mt={30} spacing={0}>
          <Title order={4}>検索結果</Title>
          {keyword === "" && tagIds.length === 0 ? (
            <NothingTheme page="initial" />
          ) : searchedThemesResult?.themes.length === 0 ? (
            <NothingTheme page="Search" />
          ) : (
            <>
              <AppSelect
                w={150}
                label="並び順"
                value={order}
                onChange={handleChangeOrder}
                data={themeOrderItems}
              />
              <Space mt="xl" />
              <ThemeCardContainer themes={searchedThemesResult?.themes ?? []} />
            </>
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
