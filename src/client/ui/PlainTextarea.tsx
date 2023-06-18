import { Textarea, TextareaProps } from "@mantine/core";
import { forwardRef } from "react";
import { OmitStrict } from "../../types/OmitStrict";

type Props = {} & OmitStrict<TextareaProps, "styles">;

export const PlainTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function PlainTextarea({ ...others }, ref) {
    return (
      <Textarea
        {...others}
        ref={ref}
        styles={() => ({
          input: {
            borderWidth: "0px",
            transition: "background-color 250ms",
            "&:invalid": { color: "red" },
          },
          wrapper: { outline: "none!important" },
          invalid: {
            border: "none",
          },
        })}
      />
    );
  }
);
