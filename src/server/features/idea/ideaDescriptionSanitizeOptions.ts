import { IOptions, simpleTransform } from "sanitize-html";

export const ideaDescriptionSanitizeOptions: IOptions = {
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
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src"],
  },
  transformTags: {
    a: simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
  },
  allowedSchemes: ["http", "https"],
};
