import RootLayout from "@/app/layout";
import { render } from "@testing-library/react";

describe("RootLayout body content", () => {
  it("renders children correctly", async () => {
    const children = <div data-testid="child">Test Child</div>;
    const result = await RootLayout({ children });

    expect(result).not.toBeNull();

    const { getByTestId } = render(result);
    expect(getByTestId("child")).toHaveTextContent("Test Child");
  });
});
