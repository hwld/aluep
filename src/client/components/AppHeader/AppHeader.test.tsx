import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("アプリのタイトルが表示されている", () => {
    const { getByText } = render(<AppHeader />);
    expect(getByText("AppThemePost")).toBeInTheDocument();
  });
});
