import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@tests/test-utils";
import React from "react";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput component", () => {
  it("renders without crashing", () => {
    render(<PasswordInput placeholder="Enter password" />);

    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByLabelText("Show password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Hide password")).not.toBeInTheDocument();
  });

  it("initially sets type to password", () => {
    render(<PasswordInput placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;

    expect(input.type).toBe("password");
    expect(screen.getByLabelText("Show password")).toBeInTheDocument();
  });

  it("toggles password visibility when icon is clicked", () => {
    render(<PasswordInput placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const icon = screen.getByLabelText("Show password");

    expect(input.type).toBe("password");

    fireEvent.click(icon);
    expect(input.type).toBe("text");
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(input.type).toBe("password");
    expect(screen.getByLabelText("Show password")).toBeInTheDocument();
  });

  it("applies other input attributes", () => {
    render(<PasswordInput id="password-id" disabled maxLength={20} name="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    expect(input).toHaveAttribute("name", "password");
    expect(input).toHaveAttribute("id", "password-id");
    expect(input).toHaveAttribute("maxlength", "20");
    expect(input).toBeDisabled();
  });

  it("calls onChange handler", async () => {
    const onChange = vi.fn();
    render(<PasswordInput placeholder="Password" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Password");
    fireEvent.input(input, { target: { value: "123" } });

    expect(onChange).toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("123");
  });

  it("merges custom className", () => {
    render(<PasswordInput className="custom-class" placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveClass("custom-class");
  });

  it("forwards the ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("updates value correctly with user-event", async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here") as HTMLInputElement;

    await user.type(input, "Hello");
    expect(input.value).toBe("Hello");
  });
});
