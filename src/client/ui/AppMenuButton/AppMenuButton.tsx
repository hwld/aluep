import { stopPropagation } from "@/client/lib/utils";
import { ActionIcon, Menu } from "@mantine/core";
import { TbDots } from "react-icons/tb";
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
        <TbDots size="70%" />
      </ActionIcon>
    </Menu.Target>
  );
};
