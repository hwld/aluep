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
            <RichTextEditor.Bold title="太文字" icon={() => <></>} />
            <RichTextEditor.Strikethrough title="打ち消し" icon={() => <></>} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H2 icon={() => <></>} />
            <RichTextEditor.H3 icon={() => <></>} />
            <RichTextEditor.H4 icon={() => <></>} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList icon={() => <></>} />
            <RichTextEditor.OrderedList icon={() => <></>} />
            <RichTextEditor.Hr icon={() => <></>} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditorImageUploader />
            {/* sanitize-htmlでaたぐにtarget="_blank"を強制的に付与しているが、
            このコントロールでそれがなくせるように見えてしまう */}
            <RichTextEditor.Link icon={() => <></>} />
            <RichTextEditor.Unlink icon={() => <></>} />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Stack>
  );
};
