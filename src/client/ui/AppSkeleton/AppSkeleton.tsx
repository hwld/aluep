import { Box, BoxProps } from "@mantine/core";
import classes from "./AppSkeleton.module.css";

type Props = Omit<BoxProps, "className">;

export const AppSkeleton: React.FC<Props> = (props) => {
  return <Box {...props} className={classes.root} />;
};
