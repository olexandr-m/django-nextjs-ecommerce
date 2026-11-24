import { render, screen } from "@tests/test-utils";
import { ExceptionView } from "./exception-view";

const mockProps = {
  code: "404",
  title: "Page Not Found",
  description: "Sorry, we couldn't find the page you're looking for.",
  buttonLink: "/",
  buttonText: "Go Home",
};

describe("ExceptionView", () => {
  it("renders with correct props", () => {
    render(<ExceptionView {...mockProps} />);

    expect(screen.getByText(mockProps.code)).toBeInTheDocument();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it("renders button with correct link and text", () => {
    render(<ExceptionView {...mockProps} />);

    const link = screen.getByRole("button", { name: mockProps.buttonText });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", mockProps.buttonLink + "en");
  });
});
