import { OmitStrict } from "@/types/OmitStrict";
import { Textarea, TextareaProps } from "@mantine/core";
import { forwardRef } from "react";
import classes from "./PlainTextarea.module.css";

type Props = {} & OmitStrict<TextareaProps, "styles">;

export const PlainTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function PlainTextarea({ ...others }, ref) {
    return (
      <Textarea
        {...others}
        ref={ref}
        classNames={{
          input: classes.input,
          wrapper: classes.wrapper,
          error: classes.error,
        }}
      />
    );
  }
);
