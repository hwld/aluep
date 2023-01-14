import { Box, Card, Flex, Title } from "@mantine/core";
import React from "react";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { ThemeOrder, themeOrderSchema } from "../../share/schema";
import { themeOrderItems } from "../consts";
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
  page: string;
};

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [{ keyword, tagIds, order, page }, setQueryParams] =
    useURLParams<ThemeSearchPageQueryParams>({
      keyword: "",
      tagIds: [],
      order: "createdDesc",
      page: "1",
    });

  const { searchedThemesResult } = useSearchedThemesQuery({
    keyword,
    tagIds,
    order,
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
          <AppSelect
            w={150}
            value={order}
            onChange={handleChangeOrder}
            data={themeOrderItems}
          />
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
