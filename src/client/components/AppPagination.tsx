import {
  Box,
  MantineStyleSystemProps,
  Pagination,
  PaginationProps,
} from "@mantine/core";

type Props = Pick<PaginationProps, "page" | "onChange" | "total"> &
  MantineStyleSystemProps;

export const AppPagination: React.FC<Props> = ({
  page,
  onChange,
  total,
  ...styleProps
}) => {
  if (total < 1) {
    return null;
  }

  return (
    <Box
      bg="gray.1"
      sx={(theme) => ({
        alignSelf: "center",
        borderRadius: theme.radius.md,
        overflow: "hidden",
        boxShadow: theme.shadows.sm,
      })}
      py={7}
      px="sm"
      {...styleProps}
    >
      <Pagination
        siblings={3}
        page={page}
        onChange={onChange}
        total={total}
        styles={(theme) => ({
          item: {
            backgroundColor: theme.colors.gray[1],
            color: theme.colors.gray[5],
            border: "none",
            whiteSpace: "nowrap",
            "&[data-active]": {
              color: theme.colors.gray[1],
            },
            "&:not([data-dots]):not([data-active]):hover": {
              transition: "background-color 150ms",
              backgroundColor: theme.colors.gray[2],
              color: theme.colors.gray[7],
            },
          },
        })}
        sx={(theme) => ({ flexWrap: "nowrap", gap: 2 })}
      />
    </Box>
  );
};
