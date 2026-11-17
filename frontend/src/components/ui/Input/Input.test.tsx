import { Input } from "@/components/ui/Input";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@tests/test-utils";
import React from "react";

const icon = <div data-testid="icon">x</div>;

describe("Input component", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Type here" />);

    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("renders start icon", () => {
    render(<Input placeholder="input" startIcon={icon} />);
    const input = screen.getByPlaceholderText("input") as HTMLInputElement;
    const startIcon = screen.getByTestId("icon") as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(startIcon).toBeInTheDocument();
  });

  it("renders end icon", () => {
    render(<Input endIcon={icon} placeholder="input" />);
    const input = screen.getByPlaceholderText("input") as HTMLInputElement;
    const endIcon = screen.getByTestId("icon") as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(endIcon).toBeInTheDocument();
  });

  it("calls onChange handler", async () => {
    const onChange = vi.fn();
    render(<Input placeholder="Change me" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Change me");
    fireEvent.input(input, { target: { value: "abc" } });

    expect(onChange).toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("abc");
  });

  it("can be focused and blurred", () => {
    const { getByPlaceholderText } = render(<Input placeholder="Focus me" />);
    const input = getByPlaceholderText("Focus me") as HTMLInputElement;

    input.focus();
    expect(document.activeElement).toBe(input);

    input.blur();
    expect(document.activeElement).not.toBe(input);
  });

  it("merges custom className", () => {
    render(<Input className="custom-class" placeholder="Class test" />);
    const input = screen.getByPlaceholderText("Class test");
    expect(input).toHaveClass("custom-class");
  });

  it("applies all passed HTML attributes", () => {
    render(
      <Input
        id="input-id"
        disabled
        maxLength={10}
        name="test-input"
        placeholder="Enter text"
        type="email"
        value="Hello"
      />,
    );

    const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveAttribute("name", "test-input");
    expect(input).toHaveAttribute("id", "input-id");
    expect(input).toHaveAttribute("maxlength", "10");

    expect(input.value).toBe("Hello");
  });

  it("forwards the ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("updates value correctly with user-event", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here") as HTMLInputElement;

    await user.type(input, "Hello");
    expect(input.value).toBe("Hello");
  });
});
