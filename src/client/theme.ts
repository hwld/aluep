import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  fontFamily: `'Noto Sans JP', sans-serif`,
  headings: {
    fontFamily: `'Noto Sans JP', sans-serif`,
  },
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
};
