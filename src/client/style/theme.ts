import {
  Button,
  Card,
  Divider,
  Input,
  InputWrapper,
  MultiSelect,
  Notification,
  Paper,
  Radio,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip,
  createTheme,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import buttonClasses from "./components/button.module.css";
import cardClasses from "./components/card.module.css";
import dividerClasses from "./components/divider.module.css";
import inputWrapperClasses from "./components/input-wrapper.module.css";
import inputClasses from "./components/input.module.css";
import notificationClasses from "./components/notification.module.css";
import paperClasses from "./components/paper.module.css";
import radioClasses from "./components/radio.module.css";
import selectClasses from "./components/select.module.css";
import textClasses from "./components/text.module.css";
import titleClasses from "./components/title.module.css";
import tooltipClasses from "./components/tooltip.module.css";

export const theme = createTheme({
  fontFamily: `'Noto Sans JP', sans-serif`,
  headings: {
    fontFamily: `'Noto Sans JP', sans-serif`,
  },
  shadows: {
    sm: "0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  radius: {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
  primaryColor: "red",
  primaryShade: 7,
  colors: {
    // tailwindのSlate
    dark: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
    ],
    // tailwindのZinc
    gray: [
      "#fafafa",
      "#f4f4f5",
      "#e4e4e7",
      "#d4d4d8",
      "#a1a1aa",
      "#71717a",
      "#52525b",
      "#3f3f46",
      "#27272a",
      "#18181b",
    ],
    // tailwindのred
    red: [
      "#fef2f2",
      "#fee2e2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
    ],
  },
  components: {
    Button: Button.extend({
      classNames: { root: buttonClasses.root },
    }),
    Title: Title.extend({
      classNames: { root: titleClasses.root },
    }),
    Tooltip: Tooltip.extend({
      classNames: {
        tooltip: tooltipClasses.tooltip,
      },
    }),
    Paper: Paper.extend({
      classNames: { root: paperClasses.root },
    }),
    Text: Text.extend({
      classNames: { root: textClasses.root },
    }),
    Card: Card.extend({
      classNames: { root: cardClasses.root },
    }),
    Divider: Divider.extend({
      classNames: { root: dividerClasses.root },
    }),
    Input: Input.extend({
      classNames: {
        input: inputClasses.input,
      },
    }),
    InputWrapper: InputWrapper.extend({
      classNames: { label: inputWrapperClasses.label },
    }),
    Radio: Radio.extend({
      classNames: { label: radioClasses.label },
    }),
    TextInput: TextInput.extend({ defaultProps: { autoComplete: "off" } }),
    Select: Select.extend({
      classNames: {
        option: selectClasses.option,
        dropdown: selectClasses.dropdown,
      },
    }),
    // TODO: Comboboxっていうのが新しく追加されてるっぽい。
    MultiSelect: MultiSelect.extend({
      // defaultProps: { transitionDuration: 150, transition: "pop-top-left" },
      styles: (theme) => ({
        label: { color: theme.colors.gray[5] },
        item: {
          color: theme.colors.gray[7],
          // TODO:
          // "&[aria-selected='true']": {
          //   backgroundColor: theme.colors.gray[2],
          // },
        },
        defaultValue: {
          backgroundColor: theme.colors.gray[2],
          color: theme.colors.gray[7],
        },

        dropdown: {
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.gray[0],
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: theme.colors.gray[3],
        },
      }),
    }),
    Notification: Notification.extend({
      classNames: {
        root: notificationClasses.root,
        description: notificationClasses.description,
      },
    }),
    RichTextEditor: RichTextEditor.extend({
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.md,
          outline: "transparent solid 0px",
          transition: "outline 100ms",
          // TODO
          "&:focus-within": {
            outline: `${theme.colors.gray[4]} solid 2px`,
            outlineOffset: "2px",
          },
        },
        toolbar: {
          backgroundColor: theme.colors.gray[1],
          borderColor: theme.colors.gray[3],
          borderTopLeftRadius: theme.radius.md,
          borderTopRightRadius: theme.radius.md,
        },
        control: {
          backgroundColor: "transparent",
          borderColor: theme.colors.gray[3],
          outline: "transparent solid 0px",
          transition: "outline 100ms",
          "&:focus": {
            outline: `${theme.colors.gray[4]} solid 2px`,
            outlineOffset: "2px",
          },
        },
        content: {
          // 新規作成時のSSRでレイアウトシフトが起きないように高さに合わせておく
          // 更新のときにはレイアウトシフトが起こってしまう。
          minHeight: "332px",
          ".ProseMirror": { minHeight: "300px" },
          backgroundColor: "transparent",
        },
      }),
    }),
  },
});
