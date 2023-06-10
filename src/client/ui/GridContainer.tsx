import { Box } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & { minItemWidthPx: number };
export const GridContainer: React.FC<Props> = ({
  children,
  minItemWidthPx,
}) => {
  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidthPx}px, 1fr))`,
        gridAutoRows: "max-content",
        gap: theme.spacing.md,
      })}
    >
      {children}
    </Box>
  );
};
