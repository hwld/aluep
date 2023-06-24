import { AppPagination } from "@/client/ui/AppPagination";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem";
import { GridContainer } from "@/client/ui/GridContainer";
import { Stack, Flex } from "@mantine/core";
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
