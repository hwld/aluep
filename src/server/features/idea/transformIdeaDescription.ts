import { ideaDescriptionSanitizeOptions } from "@/server/features/idea/ideaDescriptionSanitizeOptions";
import { JSDOM } from "jsdom";
import sanitize from "sanitize-html";

export const transformIdeaDescription = (rawHtml: string) => {
  const sanitized = sanitize(rawHtml, ideaDescriptionSanitizeOptions);

  const dom = new JSDOM(sanitized);

  const headings = dom.window.document.querySelectorAll("h1,h2,h3,h4,h5,h6");
  const ids: string[] = [];
  headings.forEach((h) => {
    if (!h.textContent) {
      return;
    }

    let id = h.textContent;

    // idが重複しているかチェックする
    const count = ids.filter((i) => i === id).length;
    if (count > 0) {
      id = id + "-" + count;
    }

    h.setAttribute("id", encodeURIComponent(id));
    ids.push(id);
  });

  return dom.serialize();
};
