import { MultiSelect, MultiSelectProps } from "@mantine/core";

type Props = MultiSelectProps;
export const AppMultiSelect: React.FC<Props> = ({ ...props }) => {
  return (
    <MultiSelect
      styles={(theme) => ({
        input: { backgroundColor: theme.colors.gray[0] },
        label: { color: theme.colors.gray[5] },
        item: { color: theme.colors.gray[7] },
        defaultValue: {
          backgroundColor: theme.colors.gray[2],
          color: theme.colors.gray[7],
        },
      })}
      {...props}
    />
  );
};
