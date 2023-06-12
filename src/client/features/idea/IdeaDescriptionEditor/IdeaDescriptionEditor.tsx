import { Stack, Sx } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

export const ideaDescriptionStyles: Sx = (theme) => ({
  color: theme.colors.gray[7],
  "& p": { margin: 0, minHeight: "1rem" },
  "& strong": { color: theme.colors.red[7] },
  "& a": { color: theme.colors.blue[5] },
  "h1, h2, h3, h4, h5, h6": {
    margin: "0.1rem 0 0.1rem 0",
  },
});

type Props = { editor: Editor | null; error?: boolean };
export const IdeaDescriptionEditor: React.FC<Props> = ({
  editor,
  error = false,
}) => {
  return (
    <Stack spacing={0}>
      <RichTextEditor
        editor={editor}
        sx={(theme) => ({
          ...(error && {
            borderColor: theme.colors.red[7],
            borderWidth: "2px",
          }),
        })}
        withCodeHighlightStyles={false}
        withTypographyStyles={false}
      >
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold title="太文字" />
            <RichTextEditor.Strikethrough title="打ち消し" />
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
        <RichTextEditor.Content sx={ideaDescriptionStyles} />
      </RichTextEditor>
    </Stack>
  );
};
