import translations from "@/locales/en/common.json";
import { render, screen, setMessages } from "@tests/test-utils";
import MainNavbar from "../main-navbar";

vi.mock("../sticky-navbar", () => ({
  default: () => <div data-testid="mock-sticky-navbar" />,
}));

const locale_keys: (keyof typeof translations.main_layout)[] = [
  "welcome",
  "register",
  "login",
  "home",
  "shop",
  "categories",
  "pages",
  "about",
  "contacts",
  "faq",
  "order_track",
  "my_account",
  "blog",
];

describe("MainNavbar", () => {
  beforeEach(() => {
    setMessages({});
    vi.resetAllMocks();
  });

  describe("rendering", () => {
    it("renders child components", () => {
      const element = MainNavbar();

      const { getByTestId } = render(element);

      expect(getByTestId("mock-sticky-navbar")).toBeDefined();
    });

    it("renders with correct translations when locale is en", () => {
      setMessages(translations.main_layout);
      const element = MainNavbar();
      render(element);

      locale_keys.forEach((key) => {
        expect(screen.getByText(translations.main_layout[key])).toBeInTheDocument();
      });
    });

    it("renders all expected links with correct href", () => {
      const element = MainNavbar();
      render(element);

      expect(screen.getByRole("button", { name: "register" })).toHaveAttribute("href", "/en/register");
      expect(screen.getByRole("button", { name: "login" })).toHaveAttribute("href", "/en/login");
      expect(screen.getByRole("link", { name: "home" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "shop" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "about" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "contacts" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "faq" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "order_track" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "my_account" })).toHaveAttribute("href", "/en");
      expect(screen.getByRole("link", { name: "blog" })).toHaveAttribute("href", "/en");

      expect(screen.getByTestId("user-icon")).toHaveAttribute("href", "/en/account");
      expect(screen.getByTestId("heart-icon")).toHaveAttribute("href", "/en");
      expect(screen.getByTestId("cart-icon")).toHaveAttribute("href", "/en");
    });

    it("renders logo as a link with image", async () => {
      const element = MainNavbar();
      render(element);

      const logoLink = screen.getByRole("link", { name: /logo/i });
      expect(logoLink).toHaveAttribute("href", "/en");

      const logoImage = screen.getByAltText("Logo");
      expect(logoImage.closest("a")).toHaveAttribute("href", "/en");
    });
  });
});
