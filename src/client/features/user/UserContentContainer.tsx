import { Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";
import { AppPagination } from "../../ui/AppPagination";
import { GridContainer } from "../../ui/GridContainer";
import { EmptyUserContentItem } from "./EmptyUserContentItem";

type Props = {
  children: ReactNode;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  itemMinWidthPx: number;
  isEmpty: boolean;
  emptyIcon: ReactNode;
  emptyText: string;
};
export const UserContentContainer: React.FC<Props> = ({
  children,
  page,
  onChangePage,
  totalPages,
  itemMinWidthPx,
  isEmpty,
  emptyIcon,
  emptyText,
}) => {
  return (
    <Stack w="100%">
      {isEmpty ? (
        <Flex align="flex-start" direction="column">
          <EmptyUserContentItem icon={emptyIcon} text={emptyText} />
        </Flex>
      ) : (
        <GridContainer minItemWidthPx={itemMinWidthPx}>
          {children}
        </GridContainer>
      )}

      <AppPagination page={page} onChange={onChangePage} total={totalPages} />
    </Stack>
  );
};
