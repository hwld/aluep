import {
  Box,
  MantineStyleProps,
  Pagination,
  PaginationProps,
} from "@mantine/core";
import classes from "./AppPagination.module.css";

type Props = Pick<PaginationProps, "value" | "onChange" | "total"> &
  MantineStyleProps;

export const AppPagination: React.FC<Props> = ({
  value,
  onChange,
  total,
  ...styleProps
}) => {
  if (total <= 1) {
    return null;
  }

  return (
    <Box bg="gray.1" className={classes.root} py={7} px="sm" {...styleProps}>
      <Pagination
        siblings={3}
        value={value}
        onChange={onChange}
        total={total}
        classNames={{
          root: classes["pagination-root"],
          control: classes["pagination-control"],
        }}
      />
    </Box>
  );
};
