import { stopPropagation } from "@/client/lib/utils";
import { SvgDots } from "@/client/ui/Icons";
import { ActionIcon, Menu } from "@mantine/core";
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
        <SvgDots width="70%" height="70%" />
      </ActionIcon>
    </Menu.Target>
  );
};
