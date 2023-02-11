import { Box } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Theme } from "../../server/models/theme";
import { ThemeCard, themeCardMinWidthPx } from "./ThemeCard/ThemeCard";

type Props = PropsWithChildren & { themes: Theme[] };
export const ThemeCardContainer: React.FC<Props> = ({ children, themes }) => {
  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${themeCardMinWidthPx}px, 1fr))`,
        gridAutoRows: "max-content",
        gap: theme.spacing.md,
      })}
    >
      {themes.map((theme) => {
        return <ThemeCard key={theme.id} theme={theme} />;
      })}
    </Box>
  );
};
