import { Button } from "@mantine/core";
import { PropsWithChildren } from "react";
import { UserDetailPageTab } from "../../../share/schema";

type Props = {
  onChangeTab: (tab: UserDetailPageTab) => void;
  tab: UserDetailPageTab;
  activeTab: UserDetailPageTab;
} & PropsWithChildren;
export const UserDetailTab: React.FC<Props> = ({
  onChangeTab,
  tab,
  activeTab,
  children,
}) => {
  const isActive = activeTab === tab;

  const handleChangeTab = () => {
    onChangeTab(tab);
  };

  return (
    <Button
      variant="default"
      w={140}
      onClick={handleChangeTab}
      bg={isActive ? "red.7" : "gray.1"}
      color={isActive ? "gray.0" : "gray.7"}
      tabIndex={isActive ? -1 : 0}
      sx={(theme) => {
        return {
          pointerEvents: isActive ? "none" : "auto",
          backgroundColor: isActive
            ? theme.colors.red[7]
            : theme.colors.gray[1],
          color: isActive ? theme.colors.gray[0] : theme.colors.gray[7],
          borderColor: isActive ? theme.colors.red[7] : theme.colors.gray[3],
          transition: "background-color 150ms, color 150ms, borderColor 150ms",
          "&:hover": {
            color: isActive ? "auto" : theme.colors.gray[9],
            backgroundColor: isActive ? "auto" : theme.colors.gray[3],
          },
        };
      }}
    >
      {children}
    </Button>
  );
};
