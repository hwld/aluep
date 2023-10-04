import { Box } from "@mantine/core";
import { PropsWithChildren } from "react";
import classes from "./GridContainer.module.css";

type Props = PropsWithChildren & { minItemWidthPx?: number };
export const GridContainer: React.FC<Props> = ({
  children,
  minItemWidthPx,
}) => {
  return (
    <Box
      style={{ "--item-min-width": `${minItemWidthPx}px` }}
      className={classes.root}
    >
      {children}
    </Box>
  );
};
