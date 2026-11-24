import { RegisterForm } from "../register-form";
import { TRegisterSchema } from "../../../schemas";
import { render, screen, setMessages, waitFor } from "@tests/test-utils";

let mockIsLoading = false;
const mockHandleRegister = vi.fn();

vi.mock("../../../hooks/use-register", () => ({
  useRegister: () => ({ handleRegister: mockHandleRegister, isLoading: mockIsLoading }),
}));

const setup = () => {
  const wrapper = render(<RegisterForm />);

  const getUsernameInput = () => wrapper.query.get.byPlaceholder(/username/i);
  const getEmailInput = () => wrapper.query.get.byPlaceholder(/email/i);
  const getPasswordInput = () => wrapper.query.get.byPlaceholder(/^password$/i);
  const getConfirmedInput = () => wrapper.query.get.byPlaceholder(/confirmed_password/i);
  const getSubmitButton = () => wrapper.query.get.byRole("button", { name: /button/i });

  return {
    ...wrapper,

    get usernameInput() {
      return getUsernameInput();
    },
    get emailInput() {
      return getEmailInput();
    },
    get passwordInput() {
      return getPasswordInput();
    },
    get confirmedPasswordInput() {
      return getConfirmedInput();
    },
    get submitButton() {
      return getSubmitButton();
    },

    async fillForm(overrides: Partial<TRegisterSchema> = {}) {
      if (overrides.username !== "")
        await wrapper.user.type(getUsernameInput(), overrides.username ?? "testuser");
      if (overrides.email !== "")
        await wrapper.user.type(getEmailInput(), overrides.email ?? "test@example.com");
      if (overrides.password !== "")
        await wrapper.user.type(getPasswordInput(), overrides.password ?? "Password123!");
      if (overrides.confirmed_password !== "") {
        await wrapper.user.type(getConfirmedInput(), overrides.confirmed_password ?? "Password123!");
      }
    },
  };
};

describe("RegisterForm", () => {
  beforeEach(() => {
    setMessages({});
    vi.resetAllMocks();
    mockIsLoading = false;
  });

  describe("rendering", () => {
    it("renders all form fields", () => {
      const { usernameInput, emailInput, passwordInput, confirmedPasswordInput, submitButton } = setup();

      expect(usernameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmedPasswordInput).toBeInTheDocument();

      expect(submitButton).toBeInTheDocument();
    });

    it("renders with correct translation keys", () => {
      const { usernameInput, emailInput, passwordInput, confirmedPasswordInput, submitButton } = setup();

      expect(usernameInput).toHaveAttribute("placeholder", "username");
      expect(emailInput).toHaveAttribute("placeholder", "email");
      expect(passwordInput).toHaveAttribute("placeholder", "password");
      expect(confirmedPasswordInput).toHaveAttribute("placeholder", "confirmed_password");

      expect(submitButton).toHaveTextContent("button");
    });
  });

  describe("when user submits form", () => {
    it("calls handleRegister if validation pass", async () => {
      mockHandleRegister.mockReturnValueOnce({ unwrap: () => Promise.resolve() });
      const { user, fillForm, submitButton } = setup();

      await fillForm();
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandleRegister).toHaveBeenCalledWith(
          {
            username: "testuser",
            email: "test@example.com",
            password: "Password123!",
            confirmed_password: "Password123!",
          },
          expect.any(Function),
          expect.any(Function),
        );
      });
    });

    it("does not call handleRegister if validation fails", async () => {
      const { user, submitButton } = setup();

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandleRegister).not.toHaveBeenCalled();
      });
    });

    it("displays validation errors if fields are empty", async () => {
      const { user, submitButton } = setup();

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("username.required")).toBeInTheDocument();
        expect(screen.getByText("email.required")).toBeInTheDocument();
        expect(screen.getByText("password.required")).toBeInTheDocument();
        expect(screen.getByText("confirmed_password.required")).toBeInTheDocument();
      });
    });

    describe("when isLoading value equals true", () => {
      it("does not allow clicking the button", async () => {
        mockIsLoading = true;
        const { user, submitButton } = setup();

        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(mockHandleRegister).not.toHaveBeenCalled();
      });

      it("displays a spinner in the button", () => {
        mockIsLoading = true;
        const { submitButton } = setup();

        expect(submitButton).toHaveAttribute("aria-busy", "true");
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
      });
    });

    describe("when handleRegister call is fail", () => {
      it("displays validation errors from API", async () => {
        mockHandleRegister.mockImplementation(async (values, setError) => {
          setError("email", { type: "server", message: "must be unique" });
        });

        const { user, fillForm, emailInput, submitButton } = setup();
        const emailInputWrapper = emailInput.closest('[data-testid="form-field-wrapper"]');

        await fillForm();
        await user.click(submitButton);

        await waitFor(() => {
          expect(emailInputWrapper).toHaveTextContent("must be unique");
        });
      });

      it("keeps values when API fails", async () => {
        mockHandleRegister.mockReturnValueOnce({
          unwrap: () => Promise.reject(new Error("fail")),
        });
        const { user, fillForm, usernameInput, submitButton } = setup();

        await fillForm();
        await user.click(submitButton);

        await waitFor(() => {
          expect(usernameInput).toHaveValue("testuser");
        });
      });
    });
  });

  describe("accessibility", () => {
    it("uses noValidate on the form", () => {
      render(<RegisterForm />);

      const form = screen.getByRole("form");

      expect(form).toHaveAttribute("noValidate");
    });
  });

  describe("validation timing", () => {
    it("should not show error message while typing, only after blur", async () => {
      const { user, fillForm, emailInput } = setup();

      await user.type(emailInput, "invalid-email");

      expect(screen.queryByText("email.invalid")).not.toBeInTheDocument();

      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByText("email.invalid")).toBeInTheDocument();
      });
    });
  });
});
