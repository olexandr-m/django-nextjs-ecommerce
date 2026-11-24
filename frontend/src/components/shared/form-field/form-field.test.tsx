import { FormField } from "@/components/shared/form-field";
import { render, screen } from "@tests/test-utils";
import { useForm } from "react-hook-form";

type FormValues = {
  username: string;
  password: string;
  bio: string;
};

const Wrapper = (props: any) => {
  const {
    register,
    formState: { errors },
  } = useForm<FormValues>();
  return <FormField {...props} errors={props.errors || errors} register={register} />;
};

describe("FormField", () => {
  it("renders a text input with label", () => {
    render(<Wrapper label="Username" name="username" />);
    const input = screen.getByLabelText("Username") as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.type).toBe("text");
  });

  it("renders without a label", () => {
    render(<Wrapper name="username" />);
    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
  });

  it("renders a password input when isPassword is true", () => {
    render(<Wrapper isPassword label="Password" name="password" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;

    expect(input.type).toBe("password");
  });

  it("renders a textarea when isTextArea is true", () => {
    render(<Wrapper isTextArea label="Bio" name="bio" />);

    const textarea = screen.getByLabelText("Bio") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
  });

  it("displays an error message", () => {
    render(
      <Wrapper
        errors={{ username: { type: "required", message: "Required" } }}
        label="Username"
        name="username"
      />,
    );

    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("renders a link when provided", () => {
    render(<Wrapper label="Username" link={{ linkText: "Forgot?", linkUrl: "/forgot" }} name="username" />);
    const link = screen.getByText("Forgot?");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/forgot");
  });

  it("renders start and end icons", () => {
    const StartIcon = <span data-testid="start-icon">S</span>;
    const EndIcon = <span data-testid="end-icon">E</span>;
    render(<Wrapper endIcon={EndIcon} label="Username" name="username" startIcon={StartIcon} />);

    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  it("renders a disabled input", () => {
    render(<Wrapper disabled label="Username" name="username" />);
    const input = screen.getByLabelText("Username") as HTMLInputElement;

    expect(input).toBeDisabled();
  });

  it("applies autoComplete attribute when provided", () => {
    render(<Wrapper autoComplete="family-name" label="Username" name="username" />);
    const input = screen.getByLabelText("Username") as HTMLInputElement;

    expect(input).toHaveAttribute("autocomplete", "family-name");
  });

  it("defaults autoComplete to off when not provided for Input", () => {
    render(<Wrapper label="Username" name="username" />);
    const input = screen.getByLabelText("Username") as HTMLInputElement;

    expect(input).toHaveAttribute("autocomplete", "off");
  });
});
