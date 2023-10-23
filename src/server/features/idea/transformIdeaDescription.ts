import { ideaDescriptionSanitizeOptions } from "@/server/features/idea/ideaDescriptionSanitizeOptions";
import { JSDOM } from "jsdom";
import sanitize from "sanitize-html";

export const transformIdeaDescription = (rawHtml: string) => {
  const sanitized = sanitize(rawHtml, ideaDescriptionSanitizeOptions);

  const dom = new JSDOM(sanitized);

  const headings = dom.window.document.querySelectorAll("h1,h2,h3,h4,h5,h6");
  const ids: string[] = [];
  headings.forEach((h) => {
    addHeadingId(h, ids);
    addHeadingLink(h, dom);
  });

  return dom.serialize();
};

export const addHeadingId = (heading: Element, ids: string[]) => {
  const title = heading.textContent;
  if (!title) {
    return;
  }

  let id = title;
  const count = ids.filter((i) => i === id).length;
  if (count > 0) {
    id = id + "-" + count;
  }

  heading.setAttribute("id", encodeURIComponent(id));
  ids.push(id);
};

export const addHeadingLink = (heading: Element, dom: JSDOM) => {
  const beforeLink = heading.querySelector("a");
  if (beforeLink) {
    heading.removeChild(beforeLink);
  }

  const link = dom.window.document.createElement("a");

  const headingId = heading.getAttribute("id");
  if (!headingId) {
    return;
  }

  link.setAttribute("href", `#${headingId}`);
  heading.insertBefore(link, heading.firstChild);
};
