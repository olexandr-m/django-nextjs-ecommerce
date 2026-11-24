import { render, screen } from "@tests/test-utils";
import { Spinner } from "./spinner";
import styles from "./spinner.module.css";

describe("Spinner", () => {
  it("is accessible with role=status and sr-only text", () => {
    render(<Spinner />);

    const container = screen.getByRole("status");
    const label = screen.getByText(/loading/i);

    expect(container).toBeInTheDocument();
    expect(label).toHaveClass(styles.srOnly);
  });

  it("should apply the rotation animation class", () => {
    render(<Spinner />);

    const img = screen.getByRole("img");

    expect(img).toHaveClass(styles.spinnerBase);
  });

  it("renders with default size (md)", () => {
    const { rerender } = render(<Spinner />);
    const defaultImg = screen.getByRole("img");
    const defaultWidth = defaultImg.getAttribute("width");

    rerender(<Spinner size="md" />);

    expect(screen.getByRole("img")).toHaveAttribute("width", defaultWidth);
  });

  it.each([
    ["xxs", "12"],
    ["xs", "24"],
    ["sm", "40"],
    ["md", "80"],
    ["lg", "128"],
    ["xl", "208"],
  ] as const)("renders with size %s", (size, expectedSize) => {
    render(<Spinner size={size} />);
    const img = screen.getByRole("img", { name: "Loading..." });

    expect(img).toHaveAttribute("width", expectedSize);
    expect(img).toHaveAttribute("height", expectedSize);
    expect(img).toHaveClass(styles[size]);
  });

  it("renders the light variant by default", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("img");

    expect(spinner.getAttribute("src")).toMatch(/spinner-light/);
  });

  it("renders the dark variant when specified", () => {
    render(<Spinner variant="dark" />);

    const spinner = screen.getByRole("img");

    expect(spinner.getAttribute("src")).toMatch(/spinner-dark/);
  });
});
