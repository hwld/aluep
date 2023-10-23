import { OmitStrict } from "@/types/OmitStrict";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import { EditorOptions, useEditor } from "@tiptap/react";

export const useIdeaDescriptionEditor = (
  opts: OmitStrict<Partial<EditorOptions>, "extensions">
) => {
  return useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      ListItem,
      HardBreak.configure({ keepMarks: true }),
      History,
      Bold,
      Strike,
      Heading.configure({ levels: [2, 3, 4] }),
      BulletList,
      OrderedList,
      HorizontalRule,
      // http,httpsのみを許可
      Link.configure({
        autolink: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Image,
    ],
    ...opts,
  });
};
