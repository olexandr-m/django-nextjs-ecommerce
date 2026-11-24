import MainLayout from "@/app/[locale]/(main)/layout";
import { render } from "@testing-library/react";

describe("MainLayout", () => {
  it("renders children correctly", () => {
    const children = <div data-testid="child">Test Child</div>;
    const result = MainLayout({ children });

    expect(result).not.toBeNull();

    const { getByTestId } = render(result);
    expect(getByTestId("child")).toHaveTextContent("Test Child");
  });
});
