import { Box } from "@mantine/core";
import classes from "./AboutPage.module.css";

type Props = { icon: React.FC };

export const FunctionIcon: React.FC<Props> = ({ icon: Icon }) => {
  return (
    <Box className={classes["function-icon"]}>
      <Icon />
    </Box>
  );
};
