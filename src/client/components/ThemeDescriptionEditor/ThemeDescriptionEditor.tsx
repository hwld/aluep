import { Stack, Sx } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

export const themeDescriptionStyles: Sx = (theme) => ({
  color: theme.colors.gray[7],
  "& p": { margin: 0, minHeight: "1rem" },
  // TODO: 目立たないのでスタイルを考える
  "& strong": { color: theme.colors.red[7] },
  "& a": { color: theme.colors.blue[5] },
  "h1, h2, h3, h4, h5, h6": {
    margin: "0.1rem 0 0.1rem 0",
  },
});

type Props = { editor: Editor | null; error?: boolean };
export const ThemeDescriptionEditor: React.FC<Props> = ({
  editor,
  error = false,
}) => {
  return (
    <Stack spacing={0}>
      {/* // TODO: タブを入力できるようにしたい
      // 柔軟性を考えるとmantineを使用しないでtiptapだけで自作するべきかも */}
      <RichTextEditor
        editor={editor}
        sx={(theme) => ({
          ...(error && {
            borderColor: theme.colors.red[7],
            borderWidth: "2px",
          }),
        })}
        styles={{
          content: {
            // 新規作成時のSSRでレイアウトシフトが起きないように高さに合わせておく
            // 更新のときにはレイアウトシフトが起こってしまう。
            minHeight: "332px",
            ".ProseMirror": { minHeight: "300px" },
          },
        }}
        withCodeHighlightStyles={false}
        withTypographyStyles={false}
      >
        {/* TODO: sticky属性をつけただけではstickyにならない */}
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold title="太文字" />
            <RichTextEditor.CodeBlock title="コード" />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
            <RichTextEditor.H5 />
            <RichTextEditor.H6 />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            {/* sanitize-htmlでaたぐにtarget="_blank"を強制的に付与しているが、
            このコントロールでそれがなくせるように見えてしまう */}
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content sx={themeDescriptionStyles} />
      </RichTextEditor>
    </Stack>
  );
};
