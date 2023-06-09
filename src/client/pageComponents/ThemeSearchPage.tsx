import { Box, Card, Flex, Select, Title } from "@mantine/core";
import React from "react";
import {
  searchThemePageSchema,
  themeOrderSchema,
  themePeriodSchema,
} from "../../share/schema";
import { NothingTheme } from "../features/theme/NothingTheme";
import { ThemeCardContainer } from "../features/theme/ThemeCardContainer";
import {
  ThemeSearchForm,
  ThemeSearchParams,
} from "../features/theme/ThemeSearchForm";
import { useAllTagsQuery } from "../features/theme/useAllTagsQuery";
import { useSearchedThemesQuery } from "../features/theme/useSearchedThemesQuery";
import { themeOrderItems, themePeriodItems } from "../lib/consts";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [{ keyword, tagIds, order, period, page }, setQueryParams] =
    useURLParams(searchThemePageSchema);

  const { searchedThemesResult } = useSearchedThemesQuery({
    keyword,
    tagIds,
    order,
    period,
    page,
  });

  const handleSearch = async (param: ThemeSearchParams) => {
    setQueryParams({
      keyword: param.keyword,
      tagIds: param.tagIds,
      page: 1,
    });
  };

  const handleChangeOrder = (value: string) => {
    const order = themeOrderSchema.parse(value);
    setQueryParams({ order, page: 1 });
  };

  const handleChangePeriod = (value: string) => {
    const period = themePeriodSchema.parse(value);
    setQueryParams({ period, page: 1 });
  };

  const handleChangePage = (value: number) => {
    setQueryParams({ page: value });
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
            key={`${keyword}-${tagIds.join()}`}
            onSearch={handleSearch}
          />
        </Card>
        <Flex mt={30} align="center" justify="space-between" mb="xl">
          <Title order={4}>検索結果</Title>
          <Flex align="center" sx={(theme) => ({ gap: theme.spacing.md })}>
            <Select
              w={150}
              value={period}
              onChange={handleChangePeriod}
              data={themePeriodItems}
            />
            <Select
              w={150}
              value={order}
              onChange={handleChangeOrder}
              data={themeOrderItems}
            />
          </Flex>
        </Flex>
        {searchedThemesResult?.themes.length === 0 ? (
          <NothingTheme page="Search" />
        ) : (
          <ThemeCardContainer themes={searchedThemesResult?.themes ?? []} />
        )}
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={searchedThemesResult?.allPages ?? 0}
          mt="md"
        />
      </Flex>
    </Box>
  );
};
