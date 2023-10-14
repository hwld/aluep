import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { DevelopmentStatus } from "@prisma/client";
import { forwardRef, useMemo } from "react";
import classes from "./DevStatusSelect.module.css";

type Props = {
  allStatuses: DevelopmentStatus[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export const DevStatusSelect: React.FC<Props> = forwardRef<
  HTMLButtonElement,
  Props
>(function DevStatusSelect({ allStatuses, value, onChange, error }, ref) {
  const selectedStatus = useMemo(() => {
    return allStatuses.find((s) => s.id === value);
  }, [allStatuses, value]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = allStatuses.map((status) => (
    <Combobox.Option
      value={status.id}
      key={status.id}
      className={classes.option}
      active={status.id === value}
    >
      <DevStatusBadge status={status} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        onChange(val);
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
          {selectedStatus ? (
            <DevStatusBadge status={selectedStatus} />
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
