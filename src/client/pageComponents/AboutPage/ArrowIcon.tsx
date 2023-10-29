import { Box } from "@mantine/core";
import { IconType } from "react-icons";
import classes from "./AboutPage.module.css";

type Props = { icon: IconType };

export const ArrowIcon: React.FC<Props> = ({ icon: Icon }) => {
  return (
    <Box className={classes["arrow-icon"]}>
      <Icon />
    </Box>
  );
};
