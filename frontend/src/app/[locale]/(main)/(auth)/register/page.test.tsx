import translations_en from "@/locales/en/auth.json";
import { render, screen, setMessages } from "@tests/test-utils";
import RegisterPage, { generateMetadata } from "./page";

vi.mock("@/features/auth/components/forms", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/auth/components/forms")>();
  return {
    ...actual,
    RegisterForm: () => <div data-testid="register-form">Register Form</div>,
  };
});

describe("RegisterPage", () => {
  beforeEach(() => {
    setMessages({});
    vi.resetAllMocks();
  });

  it("renders all components", async () => {
    const Page = await RegisterPage();
    render(Page);

    expect(screen.getByTestId("auth-form-header")).toBeInTheDocument();
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("generates correct metadata", async () => {
    setMessages(translations_en.register);
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "Register | E-commerce",
      description: "Create a new account to start shopping today.",
      robots: {
        index: false,
        follow: false,
      },
    });
  });

  it("renders correct translation keys", async () => {
    render(await RegisterPage());

    expect(screen.getByRole("heading", { level: 2, name: "title" })).toBeInTheDocument();
    expect(screen.getByText("have_an_account")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "log_in" })).toBeInTheDocument();
  });

  it("renders login link", async () => {
    render(await RegisterPage());
    const link = screen.getByRole("link", { name: "log_in" });

    expect(link).toHaveAttribute("href", "/en/login");
  });
});
