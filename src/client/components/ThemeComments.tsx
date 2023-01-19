import { Card, Stack, Title } from "@mantine/core";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { useThemeComments } from "../hooks/useThemeComments";

type Props = { themeId: string };

/** お題へのコメント */
export const ThemeComments: React.FC<Props> = ({ themeId }) => {
  const { themeComments, postComment } = useThemeComments(themeId);

  const handleSubmit = (data: OmitStrict<ThemeCommentFormData, "themeId">) => {
    postComment(data);
  };

  return (
    <Stack>
      <Title mt={30} order={4}>
        投稿されたコメント
      </Title>
      <Stack spacing="xs"></Stack>
      <Card>
        {/* TODO */}
        {/* <ThemeCommentForm /> */}
      </Card>
    </Stack>
  );
};
