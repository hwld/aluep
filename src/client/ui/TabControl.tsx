import { Box, Center, SegmentedControl } from "@mantine/core";
import { useMemo } from "react";
import { IconType } from "react-icons/lib";
import classes from "./TabControl.module.css";

type Props<T extends string> = {
  activeTab: T;
  onChange: (value: T) => void;
  data: { value: T; label: string; icon?: IconType }[];
};
export const TabControl = <T extends string>({
  activeTab,
  onChange,
  data,
}: Props<T>) => {
  const innerData = useMemo(() => {
    return data.map(({ label, icon: Icon, value }) => {
      return {
        label: (
          <Center>
            {Icon && <Icon size={19} />}
            <Box ml={5}>{label}</Box>
          </Center>
        ),
        value,
      };
    });
  }, [data]);

  return (
    <SegmentedControl
      value={activeTab}
      onChange={onChange}
      data={innerData}
      color="red.7"
      classNames={{
        root: classes.root,
        control: classes.control,
        label: classes.label,
      }}
    />
  );
};
