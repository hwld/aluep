import { RichTextEditorImageUploader } from "@/client/ui/RichTextEditorImageUploader/RichTextEditorImageUploader";
import { Stack } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import clsx from "clsx";
import classes from "./IdeaDescriptionEditor.module.css";

type Props = { editor: Editor | null; error?: boolean };
export const IdeaDescriptionEditor: React.FC<Props> = ({
  editor,
  error = false,
}) => {
  return (
    <Stack gap={0}>
      <RichTextEditor
        editor={editor}
        classNames={{
          root: clsx({ [classes.error]: error }),
          content: clsx(classes.content),
        }}
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
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditorImageUploader />
            {/* sanitize-htmlでaたぐにtarget="_blank"を強制的に付与しているが、
            このコントロールでそれがなくせるように見えてしまう */}
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Stack>
  );
};
