import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useAllTagsQuery } from "../../client/hooks/useAllTagsQuery";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { useStateAndUrlParamString } from "../hooks/useStateAndUrlParamString";
import { useStateAndUrlParamStringArray } from "../hooks/useStateAndUrlParamStringArray";
import { AppMultiSelect } from "./AppMultiSelect";
import { AppTextInput } from "./AppTextInput";
import { ThemeCard } from "./ThemeCard/ThemeCard";

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [keyword, setKeyword] = useStateAndUrlParamString({
    paramName: "keyword",
    initialData: "",
  });
  // keywordが変更されてから500ms後に変更される
  const [debouncedKeyword] = useDebouncedValue(keyword, 500);

  const [tagIds, setTagIds] = useStateAndUrlParamStringArray({
    paramName: "tagIds",
    initialData: [],
  });

  const { searchedThemes } = useSearchedThemesQuery({
    keyword: debouncedKeyword,
    tagIds,
  });

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
            <Title order={2}>検索</Title>
            <AppTextInput
              label="キーワード"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <AppMultiSelect
              label="タグ"
              data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
              value={tagIds}
              onChange={setTagIds}
            />
          </Stack>
          <Text size="sm" mt={10}>
            ※指定されたタグをすべて含み、指定されたキーワードがお題のタイトルに含まれるお題を検索する。
          </Text>
        </Card>
        <Box mt={30}>
          <Title order={2}>検索結果</Title>
          <Flex mt={10} gap="md" wrap="wrap">
            {searchedThemes?.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
