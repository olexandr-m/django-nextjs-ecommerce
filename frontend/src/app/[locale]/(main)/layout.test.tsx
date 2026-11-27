import MainLayout from "@/app/[locale]/(main)/layout";
import { render } from "@testing-library/react";

vi.mock("@/components/layouts/main", () => ({
  MainNavbar: () => <nav data-testid="mock-navbar" />,
  MainFooter: () => <nav data-testid="mock-footer" />,
  MobileMenuSidebar: () => <nav data-testid="mock-sidebar" />,
  ScrollToTopButton: () => <nav data-testid="mock-scroll-to-top-button" />,
}));

describe("MainLayout", () => {
  it("renders children correctly", () => {
    const children = <div data-testid="child">Test Child</div>;
    const result = MainLayout({ children });

    expect(result).not.toBeNull();

    const { getByTestId } = render(result);
    expect(getByTestId("child")).toHaveTextContent("Test Child");
  });

  it("renders layout components", () => {
    const children = <div data-testid="child">Test Child</div>;
    const result = MainLayout({ children });

    const { getByTestId } = render(result);
    expect(getByTestId("mock-navbar")).toBeDefined();
    expect(getByTestId("mock-footer")).toBeDefined();
    expect(getByTestId("mock-sidebar")).toBeDefined();
    expect(getByTestId("mock-scroll-to-top-button")).toBeDefined();
  });
});
