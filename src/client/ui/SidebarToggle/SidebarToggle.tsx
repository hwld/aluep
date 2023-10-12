import { Burger } from "@mantine/core";
import classes from "./SidebarToggle.module.css";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  width: string;
};

export const SidebarToggle: React.FC<Props> = ({ isOpen, onToggle, width }) => {
  return (
    <Burger
      title={isOpen ? "サイドメニューを閉じる" : "サイドメニューを開く"}
      opened={isOpen}
      onClick={onToggle}
      color="var(--mantine-color-gray-1)"
      className={classes.root}
      w={width}
    />
  );
};
