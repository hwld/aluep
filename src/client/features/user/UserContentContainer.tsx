import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { GridContainer } from "@/client/ui/GridContainer/GridContainer";
import { Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  itemMinWidthPx: number;
  isEmpty: boolean;
  emptyIcon: ReactNode;
  emptyText: string;
  emptyDescription: ReactNode;
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
  emptyDescription,
}) => {
  return (
    <Stack w="100%">
      {isEmpty ? (
        <Flex align="center" direction="column">
          <EmptyContentItem
            icon={emptyIcon}
            text={emptyText}
            description={emptyDescription}
          />
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
