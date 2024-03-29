import { Box } from "@mantine/core";
import classes from "./About.module.css";

type Props = { icon: React.FC };

export const ArrowIcon: React.FC<Props> = ({ icon: Icon }) => {
  return (
    <Box className={classes["arrow-icon"]}>
      <Icon />
    </Box>
  );
};
