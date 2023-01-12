import { Box, Card, Flex, Title } from "@mantine/core";
import React from "react";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import {
  ThemeOrder,
  themeOrderSchema,
  ThemePeriod,
  themePeriodSchema,
} from "../../share/schema";
import { themeOrderItems, themePeriodItems } from "../consts";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { useURLParams } from "../hooks/useURLParams";
import { AppPagination } from "./AppPagination";
import { AppSelect } from "./AppSelect";
import { NothingTheme } from "./NothingTheme";
import { ThemeCardContainer } from "./ThemeCardContainer";
import { ThemeSearchForm, ThemeSearchParams } from "./ThemeSearchForm";

type ThemeSearchPageQueryParams = {
  keyword: string;
  tagIds: string[];
  order: ThemeOrder;
  period: ThemePeriod;
  page: string;
};

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [{ keyword, tagIds, order, period, page }, setQueryParams] =
    useURLParams<ThemeSearchPageQueryParams>({
      keyword: "",
      tagIds: [],
      order: "createdDesc",
      period: "all",
      page: "1",
    });

  const { searchedThemesResult } = useSearchedThemesQuery({
    keyword,
    tagIds,
    order,
    period,
    page: Number(page),
  });

  const handleSearch = async (param: ThemeSearchParams) => {
    setQueryParams({
      keyword: param.keyword,
      tagIds: param.tagIds,
      page: "1",
    });
  };

  const handleChangeOrder = (value: string) => {
    const order = themeOrderSchema.parse(value);
    setQueryParams({ order, page: "1" });
  };

  const handleChangePeriod = (value: string) => {
    const period = themePeriodSchema.parse(value);
    setQueryParams({ period, page: "1" });
  };

  const handleChangePage = (value: number) => {
    setQueryParams({ page: value.toString() });
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
            <AppSelect
              w={150}
              value={period}
              onChange={handleChangePeriod}
              data={themePeriodItems}
            />
            <AppSelect
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
          page={Number(page)}
          onChange={handleChangePage}
          total={searchedThemesResult?.allPages ?? 0}
          mt="md"
        />
      </Flex>
    </Box>
  );
};
