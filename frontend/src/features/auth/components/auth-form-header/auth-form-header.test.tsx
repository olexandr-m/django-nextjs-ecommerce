import { AuthFormHeader } from "./auth-form-header";
import { render, screen } from "@tests/test-utils";

describe("AuthFormHeader", () => {
  it("renders title and children correctly", () => {
    render(
      <AuthFormHeader title="Welcome">
        <button>Test Child</button>
      </AuthFormHeader>,
    );

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Test Child" })).toBeInTheDocument();
  });

  it("renders link when linkHref and linkText are provided", () => {
    render(<AuthFormHeader linkHref="/test" linkText="Click here" title="Title" />);

    const link = screen.getByRole("link", { name: "Click here" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/en/test");
  });

  it("does not render link section if linkHref is missing", () => {
    render(<AuthFormHeader linkText="No link" title="Title" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
