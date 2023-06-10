import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  globalStyles: (theme) => ({
    body: { backgroundColor: theme.colors.gray[2] },
  }),
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
    // tailwindのstone
    gray: [
      "#fafaf9",
      "#f5f5f4",
      "#e7e5e4",
      "#d6d3d1",
      "#a8a29e",
      "#78716c",
      "#57534e",
      "#44403c",
      "#292524",
      "#1c1917",
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
    Tooltip: { defaultProps: { color: "gray.7" } },
    Paper: { defaultProps: { bg: "gray.1" } },
    Text: {
      defaultProps: { color: "gray.7" },
      styles: () => ({
        root: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
      }),
    },
    Headers: {
      styles: () => ({
        root: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
      }),
    },
    Card: {
      defaultProps: { bg: "gray.1", radius: "md", shadow: "sm" },
      styles: () => ({ root: { overflow: "unset" } }),
    },
    Divider: { defaultProps: { color: "gray.3" } },
    Input: {
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.gray[7],
        },
        invalid: {
          borderColor: theme.colors.red[7],
          borderWidth: "2px",
        },
      }),
    },
    InputWrapper: {
      styles: (theme) => ({
        label: {
          color: theme.colors.gray[5],
          error: theme.colors.blue[7],
        },
      }),
    },
    Radio: { styles: (theme) => ({ label: { color: theme.colors.gray[7] } }) },
    TextInput: { defaultProps: { autoComplete: "off" } },
    Select: {
      styles: (theme) => ({
        item: {
          color: theme.colors.gray[7],
          "&:hover": {
            backgroundColor: theme.colors.gray[2],
          },
        },
        dropdown: {
          backgroundColor: theme.colors.gray[0],
          border: "1px solid",
          borderColor: theme.colors.gray[3],
        },
      }),
    },
    MultiSelect: {
      defaultProps: { transitionDuration: 150, transition: "pop-top-left" },
      styles: (theme) => ({
        input: { backgroundColor: theme.colors.gray[0] },
        label: { color: theme.colors.gray[5] },
        item: {
          color: theme.colors.gray[7],
          "&[aria-selected='true']": {
            backgroundColor: theme.colors.gray[2],
          },
        },
        defaultValue: {
          backgroundColor: theme.colors.gray[2],
          color: theme.colors.gray[7],
        },

        dropdown: {
          backgroundColor: theme.colors.gray[0],
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: theme.colors.gray[3],
        },
      }),
    },
    Notification: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.gray[1],
          borderColor: theme.colors.gray[1],
        },
        description: {
          color: theme.colors.gray[5],
        },
      }),
    },
  },
};
