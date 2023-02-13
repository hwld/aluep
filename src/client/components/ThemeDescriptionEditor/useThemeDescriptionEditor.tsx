import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { lowlight } from "lowlight";

export const useThemeDescriptionEditor = (defaultContent: string) => {
  return useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      ListItem,
      HardBreak.configure({ keepMarks: true }),
      History,
      Bold,
      CodeBlockLowlight.configure({ lowlight }),
      Heading,
      BulletList,
      OrderedList,
      HorizontalRule,
      // http,httpsのみを許可
      Link.configure({
        autolink: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content: defaultContent,
  });
};
