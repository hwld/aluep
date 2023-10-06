import { EmptyIdeaSearchResult } from "@/client/features/idea/EmptyIdeaSearchResult/EmptyIdeaSearchResult";
import {
  IdeaCard,
  ideaCardMinWidthPx,
} from "@/client/features/idea/IdeaCard/IdeaCard";
import {
  IdeaSearchArgs,
  IdeaSearchForm,
} from "@/client/features/idea/IdeaSearchForm/IdeaSearchForm";
import { useAllTagsQuery } from "@/client/features/idea/useAllTagsQuery";
import { useSearchedIdeasQuery } from "@/client/features/idea/useSearchedIdeasQuery";
import { ideaOrderItems, ideaPeriodItems } from "@/client/lib/consts";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import {
  ideaOrderSchema,
  ideaPeriodSchema,
  searchIdeaPageSchema,
} from "@/models/idea";
import { Box, Card, Flex, Select, Title } from "@mantine/core";
import React from "react";
import { TbSearch } from "react-icons/tb";

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

  const handleSearch = async (args: IdeaSearchArgs) => {
    setQueryParams({
      keyword: args.keyword,
      tagIds: args.tagIds,
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
    <>
      <PageHeader icon={TbSearch} pageName="お題の検索" />
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
                styles={(theme) => ({
                  input: {
                    backgroundColor: theme.colors.gray[1],
                    "&:hover": { backgroundColor: theme.colors.gray[2] },
                  },
                })}
              />
              <Select
                w={150}
                value={order}
                onChange={handleChangeOrder}
                data={ideaOrderItems}
                styles={(theme) => ({
                  input: {
                    backgroundColor: theme.colors.gray[1],
                    "&:hover": { backgroundColor: theme.colors.gray[2] },
                  },
                })}
              />
            </Flex>
          </Flex>
          {searchedIdeasResult?.ideas.length === 0 ? (
            <EmptyIdeaSearchResult />
          ) : (
            <GridContainer minItemWidthPx={ideaCardMinWidthPx}>
              {searchedIdeasResult?.ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </GridContainer>
          )}
          <AppPagination
            page={page}
            onChange={handleChangePage}
            total={searchedIdeasResult?.allPages ?? 0}
            mt="md"
          />
        </Flex>
      </Box>
    </>
  );
};
