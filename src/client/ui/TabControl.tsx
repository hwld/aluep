import { Box, Center, SegmentedControl } from "@mantine/core";
import { useMemo } from "react";
import { IconType } from "react-icons/lib";

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
      styles={(theme) => ({
        root: { backgroundColor: theme.colors.gray[1] },
        control: {
          borderRadius: "4px",
          transition: "background-color 150ms",
          "&:hover": {
            backgroundColor: theme.fn.rgba(theme.colors.gray[2], 0.5),
          },
        },
        controlActive: { pointerEvents: "none" },
        label: {
          fontWeight: "bold",
          color: theme.colors.gray[5],
          "&:hover": { color: theme.colors.gray[7] },
        },
        labelActive: { color: `${theme.colors.gray[1]}!important` },
      })}
    />
  );
};
