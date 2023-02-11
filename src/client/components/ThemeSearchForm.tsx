import { Box, Button, Flex, Stack, Text, Title } from "@mantine/core";
import React, { SyntheticEvent, useState } from "react";
import { ThemeTag } from "../../server/models/themeTag";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextInput } from "./AppTextInput";

export type ThemeSearchParams = {
  keyword: string;
  tagIds: string[];
};

type Props = {
  allTags: ThemeTag[];
  defaultValues?: ThemeSearchParams;
  onSearch: (params: ThemeSearchParams) => void;
};

export const ThemeSearchForm: React.FC<Props> = ({
  allTags,
  defaultValues = { keyword: "", tagIds: [] },
  onSearch,
}) => {
  const [keyword, setKeyword] = useState(defaultValues.keyword);
  const [tagIds, setTagIds] = useState<string[]>(defaultValues.tagIds);

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const handleChangeTagIds = (value: string[]) => {
    setTagIds(value);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSearch({ keyword, tagIds });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing="sm">
        <Title order={5}>検索</Title>
        <Box
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
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
        <Flex gap="lg" align="flex-end">
          <Button type="submit" sx={{ alignSelf: "flex-start" }}>
            検索
          </Button>
          <Text size="sm" c="gray.4">
            ※指定されたタグをすべて含み、指定されたキーワードがお題のタイトルに含まれるお題を検索します。
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
};
