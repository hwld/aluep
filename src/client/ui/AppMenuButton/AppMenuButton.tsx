import { stopPropagation } from "@/client/lib/utils";
import { ActionIcon, Menu } from "@mantine/core";
import { BsThreeDots } from "react-icons/bs";
import classes from "./AppMenuButton.module.css";

type Props = {};
export const AppMenuButton: React.FC<Props> = () => {
  return (
    <Menu.Target>
      <ActionIcon
        size={30}
        c="gray.7"
        className={classes.button}
        onClick={stopPropagation}
      >
        <BsThreeDots size="70%" />
      </ActionIcon>
    </Menu.Target>
  );
};
