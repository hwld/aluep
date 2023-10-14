import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import {
  allDevStatuses,
  DevStatus,
  devStatusSchema,
} from "@/models/developmentStatus";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { forwardRef } from "react";
import classes from "./DevStatusSelect.module.css";

type Props = {
  value: DevStatus;
  onChange: (value: DevStatus) => void;
  error?: boolean;
};

export const DevStatusSelect: React.FC<Props> = forwardRef<
  HTMLButtonElement,
  Props
>(function DevStatusSelect({ value, onChange, error }, ref) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = allDevStatuses.map((status) => (
    <Combobox.Option
      value={status}
      key={status}
      className={classes.option}
      active={status === value}
    >
      <DevStatusBadge status={status} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        const status = devStatusSchema.parse(val);
        onChange(status);
        combobox.closeDropdown();
      }}
      withinPortal={false}
    >
      <Combobox.Target>
        <InputBase
          label="開発状況"
          component="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          ref={ref}
          error={error}
          styles={{ input: { paddingLeft: "5px" } }}
        >
          {value ? (
            <DevStatusBadge status={value} />
          ) : (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown className={classes.dropdown}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
