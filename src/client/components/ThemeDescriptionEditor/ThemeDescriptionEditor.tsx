import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

type Props = { editor: Editor | null };
export const ThemeDescriptionEditor: React.FC<Props> = ({ editor }) => {
  return (
    // TODO: タブを入力できるようにしたい
    <RichTextEditor editor={editor}>
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
      <RichTextEditor.Content
        // TODO: このあたりのスタイルは、お題詳細画面でも共有する必要があると思う
        sx={(theme) => ({
          height: "300px",
          fontSize: "14px",
          color: theme.colors.gray[7],
          "& p": { marginBottom: 0 },
          // TODO: 目立たないのでスタイルを考える
          "& strong": { color: theme.colors.gray[9] },
          "& a": { color: theme.colors.blue[5] },
        })}
      />
    </RichTextEditor>
  );
};
