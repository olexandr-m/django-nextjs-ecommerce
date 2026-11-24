import { Button } from "@/components/ui/button";
import { fireEvent, render, screen } from "@tests/test-utils";
import React from "react";

describe("Button", () => {
  it("renders correctly with children and accessible role", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("renders with title prop if no children provided", () => {
    render(<Button title="Submit" />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("prioritizes children over the title prop", () => {
    render(<Button title="title">children</Button>);

    expect(screen.getByRole("button", { name: /children/i })).toBeInTheDocument();
    expect(screen.queryByText(/title/i)).not.toBeInTheDocument();
  });

  it("shows spinner and disables when loading", () => {
    render(<Button loading>Loading...</Button>);
    const button = screen.getByRole("button", { name: /loading/i });

    expect(button).toBeDisabled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("fires onClick when not loading", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    const button = screen.getByRole("button", { name: /click/i });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Please wait
      </Button>,
    );
    const button = screen.getByRole("button", { name: /please wait/i });

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("is forwardRef compatible", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Ref Test</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
