import { Menu as MantineMenu, MenuProps, Overlay } from "@mantine/core";
import { ReactNode, useState } from "react";

type Props = { children: ReactNode } & MenuProps;
// mantineのMenuと被るのでAppMenuにする
export const AppMenu: React.FC<Props> = ({ children, ...props }) => {
  const [opened, setOpened] = useState(false);

  return (
    <MantineMenu
      transitionProps={{ transition: "pop" }}
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      radius="md"
      styles={{
        item: { transition: "all 200ms" },
        dropdown: {
          minWidth: "200px",
          backgroundColor: "var(--mantine-color-gray-1)",
          boxShadow: "var(--mantine-shadow-md)",
          padding: "4px 4px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "var(--mantine-color-gray-2)",
        },
      }}
      {...props}
    >
      {/* メニューを開いているときは、メニュー外のアイテムをクリックできなくする */}
      {opened && <Overlay opacity={0} style={{ position: "fixed" }} />}
      {children}
    </MantineMenu>
  );
};
