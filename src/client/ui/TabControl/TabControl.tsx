import { Box, Center, SegmentedControl } from "@mantine/core";
import { SVGProps, useMemo } from "react";
import classes from "./TabControl.module.css";

type Props<T extends string> = {
  activeTab: T;
  onChange: (value: T) => void;
  data: { value: T; label: string; icon?: React.FC<SVGProps<SVGSVGElement>> }[];
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
            {Icon && <Icon width={19} height={19} />}
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
