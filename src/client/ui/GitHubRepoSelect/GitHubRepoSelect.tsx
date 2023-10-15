import { MutedText } from "@/client/ui/MutedText/MutedText";
import {
  ActionIcon,
  Combobox,
  Group,
  Input,
  InputBase,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { FocusEventHandler, forwardRef, useMemo, useState } from "react";
import { TbBook, TbReload } from "react-icons/tb";
import classes from "./GitHubRepoSelect.module.css";

type Props = {
  name?: string;
  label?: string;
  repositories: { name: string; url: string }[];
  value: string;
  onChange: (urlValue: string) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onUpdateList: () => void;
  error?: boolean;
};

export const GitHubRepoSelect: React.FC<Props> = forwardRef<
  HTMLButtonElement,
  Props
>(function Component(
  {
    name,
    label = "GitHubリポジトリ",
    repositories,
    value,
    onChange,
    onBlur,
    onUpdateList,
    error,
  },
  ref
) {
  const selectedName = useMemo(() => {
    return repositories.find((repo) => repo.url === value)?.name ?? "";
  }, [repositories, value]);

  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const options = repositories
    .filter((repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((repo) => (
      <Combobox.Option
        className={classes["option"]}
        value={repo.url}
        key={repo.url}
      >
        {repo.name}
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          name={name}
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          onBlur={onBlur}
          rightSectionPointerEvents="none"
          error={error}
          ref={ref}
        >
          {selectedName || (
            <Input.Placeholder>リポジトリを選択してください</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown classNames={{ dropdown: classes["dropdown"] }}>
        <Combobox.Header style={{}}>
          <Group justify="space-between">
            <Group gap={5} align="center">
              <TbBook color="var(--mantine-color-gray-5)" />
              <MutedText>リポジトリ一覧</MutedText>
            </Group>
            <ActionIcon size="sm" bg="gray.2" onClick={onUpdateList}>
              <TbReload color="var(--mantine-color-gray-7)" />
            </ActionIcon>
          </Group>
        </Combobox.Header>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search repositories..."
          classNames={{ input: classes["search-input"] }}
        />
        <Combobox.Options>
          <ScrollArea.Autosize mah={300} type="always">
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
