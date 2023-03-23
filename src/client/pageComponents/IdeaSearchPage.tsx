import { Box, Card, Flex, Select, Title } from "@mantine/core";
import React from "react";
import {
  ideaOrderSchema,
  ideaPeriodSchema,
  searchIdeaPageSchema,
} from "../../share/schema";
import { IdeaCardContainer } from "../features/idea/IdeaCardContainer";
import {
  IdeaSearchForm,
  IdeaSearchParams,
} from "../features/idea/IdeaSearchForm";
import { NothingIdea } from "../features/idea/NothingIdea";
import { useAllTagsQuery } from "../features/idea/useAllTagsQuery";
import { useSearchedIdeasQuery } from "../features/idea/useSearchedIdeasQuery";
import { ideaOrderItems, ideaPeriodItems } from "../lib/consts";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";

export const IdeaSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [{ keyword, tagIds, order, period, page }, setQueryParams] =
    useURLParams(searchIdeaPageSchema);

  const { searchedIdeasResult } = useSearchedIdeasQuery({
    keyword,
    tagIds,
    order,
    period,
    page,
  });

  const handleSearch = async (param: IdeaSearchParams) => {
    setQueryParams({
      keyword: param.keyword,
      tagIds: param.tagIds,
      page: 1,
    });
  };

  const handleChangeOrder = (value: string) => {
    const order = ideaOrderSchema.parse(value);
    setQueryParams({ order, page: 1 });
  };

  const handleChangePeriod = (value: string) => {
    const period = ideaPeriodSchema.parse(value);
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
          <IdeaSearchForm
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
              data={ideaPeriodItems}
            />
            <Select
              w={150}
              value={order}
              onChange={handleChangeOrder}
              data={ideaOrderItems}
            />
          </Flex>
        </Flex>
        {searchedIdeasResult?.ideas.length === 0 ? (
          <NothingIdea page="Search" />
        ) : (
          <IdeaCardContainer ideas={searchedIdeasResult?.ideas ?? []} />
        )}
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={searchedIdeasResult?.allPages ?? 0}
          mt="md"
        />
      </Flex>
    </Box>
  );
};