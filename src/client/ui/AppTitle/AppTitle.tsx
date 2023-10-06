import { Title, TitleProps } from "@mantine/core";
import React from "react";

type Props = TitleProps & { truncate?: boolean };
export const AppTitle: React.FC<Props> = ({ children, truncate, ...props }) => {
  return (
    <Title
      {...props}
      style={
        truncate
          ? {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              ...props.style,
            }
          : props.style
      }
    >
      {children}
    </Title>
  );
};
