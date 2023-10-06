import { IdeaTag } from "@/models/ideaTag";
import {
  Box,
  Button,
  Flex,
  Grid,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { SyntheticEvent, useState } from "react";

export type IdeaSearchArgs = {
  keyword: string;
  tagIds: string[];
};

type Props = {
  allTags: IdeaTag[];
  defaultValues?: IdeaSearchArgs;
  onSearch: (args: IdeaSearchArgs) => void;
};

export const IdeaSearchForm: React.FC<Props> = ({
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
      <Stack gap="sm">
        <Title order={5}>検索</Title>
        <Grid p="xs">
          <Grid.Col span={{ md: 6 }}>
            <TextInput
              label="キーワード"
              value={keyword}
              onChange={handleChangeKeyword}
            />
          </Grid.Col>
          <Grid.Col span={{ md: 6 }}>
            <MultiSelect
              label="タグ"
              data={allTags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              value={tagIds}
              onChange={handleChangeTagIds}
              searchable
            />
          </Grid.Col>
        </Grid>
        <Flex gap="lg" align="flex-end">
          <Button type="submit" style={{ alignSelf: "flex-start" }}>
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
