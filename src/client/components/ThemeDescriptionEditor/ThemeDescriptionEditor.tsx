import { Sx } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

export const themeDescriptionStyles: Sx = (theme) => ({
  color: theme.colors.gray[7],
  "& p": { margin: 0, minHeight: "1rem" },
  // TODO: 目立たないのでスタイルを考える
  "& strong": { color: theme.colors.gray[9] },
  "& a": { color: theme.colors.blue[5] },
  "h1, h2, h3, h4, h5, h6": {
    margin: "0.1rem 0 0.1rem 0",
  },
});

type Props = { editor: Editor | null };
export const ThemeDescriptionEditor: React.FC<Props> = ({ editor }) => {
  return (
    // TODO: タブを入力できるようにしたい
    <RichTextEditor
      editor={editor}
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
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content sx={themeDescriptionStyles} />
    </RichTextEditor>
  );
};
