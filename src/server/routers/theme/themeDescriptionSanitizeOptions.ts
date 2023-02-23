import { IOptions, simpleTransform } from "sanitize-html";

export const themeDescriptionSanitizeOptions: IOptions = {
  allowedTags: [
    "p",
    "strong",
    "per",
    "code",
    "span",
    "s",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "hr",
    "br",
  ],
  allowedAttributes: {
    a: ["href", "target"],
  },
  transformTags: { a: simpleTransform("a", { target: "_blank" }) },
  allowedSchemes: ["http", "https"],
};
