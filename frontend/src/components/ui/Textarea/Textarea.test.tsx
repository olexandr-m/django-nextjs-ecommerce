import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@tests/test-utils";
import React from "react";
import { Textarea } from "./Textarea";

describe("Textarea component", () => {
  it("renders without crashing", () => {
    render(<Textarea placeholder="Enter text" />);

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("has default rows = 4", () => {
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText("Enter text") as HTMLTextAreaElement;
    expect(textarea.rows).toBe(4);
  });

  it("applies custom rows", () => {
    render(<Textarea placeholder="Enter text" rows={6} />);

    const textarea = screen.getByPlaceholderText("Enter text") as HTMLTextAreaElement;
    expect(textarea.rows).toBe(6);
  });

  it("applies all passed HTML attributes", () => {
    render(
      <Textarea
        id="input-id"
        disabled
        maxLength={10}
        name="test-input"
        placeholder="Enter text"
        value="Hello"
      />,
    );

    const textarea = screen.getByPlaceholderText("Enter text") as HTMLInputElement;

    expect(textarea).toHaveAttribute("disabled");
    expect(textarea).toHaveAttribute("name", "test-input");
    expect(textarea).toHaveAttribute("id", "input-id");
    expect(textarea).toHaveAttribute("maxlength", "10");

    expect(textarea.value).toBe("Hello");
  });

  it("merges custom className", () => {
    render(<Textarea className="custom-class" placeholder="Text" />);
    const textarea = screen.getByPlaceholderText("Text");

    expect(textarea).toHaveClass("custom-class");
  });

  it("calls onChange handler", async () => {
    const onChange = vi.fn();
    render(<Textarea placeholder="Type here" onChange={onChange} />);
    const textarea = screen.getByPlaceholderText("Type here");

    fireEvent.input(textarea, { target: { value: "abc" } });

    expect(onChange).toHaveBeenCalled();
    expect((textarea as HTMLTextAreaElement).value).toBe("abc");
  });

  it("forwards the ref to the input element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("updates value correctly with user-event", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here") as HTMLTextAreaElement;

    await user.type(input, "Hello");
    expect(input.value).toBe("Hello");
  });
});
