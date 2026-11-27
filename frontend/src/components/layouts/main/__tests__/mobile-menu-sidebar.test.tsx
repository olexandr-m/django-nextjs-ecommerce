import MobileMenuSidebar from "../mobile-menu-sidebar";
import translations from "@/locales/en/common.json";
import { fireEvent, render, screen, setMessages } from "@tests/test-utils";

const locale_keys: (keyof typeof translations.main_layout)[] = [
  "home",
  "shop",
  "categories",
  "pages",
  "cart",
  "compare_products",
  "wish_list",
  "account",
  "order_track",
  "blog",
  "contacts",
  "sign_in",
  "register",
];

describe("MobileMenuSidebar", () => {
  beforeEach(() => {
    setMessages({});
    vi.resetAllMocks();
  });

  it("renders with correct translations when locale is en", () => {
    setMessages(translations.main_layout);
    render(<MobileMenuSidebar />);

    locale_keys.forEach((key) => {
      expect(screen.getByText(translations.main_layout[key])).toBeInTheDocument();
    });
  });

  it("renders all sidebar links", () => {
    render(<MobileMenuSidebar />);
    fireEvent.click(screen.getByTestId("toggle-menu"));

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
    expect(screen.getByText(/pages/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contacts/i })).toBeInTheDocument();
  });

  it("renders all pages links", () => {
    render(<MobileMenuSidebar />);
    fireEvent.click(screen.getByTestId("toggle-menu"));
    fireEvent.click(screen.getByText(/pages/i));

    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /wish_list/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /compare_products/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /order_track/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /account/i })).toBeInTheDocument();
  });

  it("renders logo with link", () => {
    render(<MobileMenuSidebar />);

    const logoLink = screen.getByRole("link", { name: /logo/i });
    expect(logoLink).toHaveAttribute("href", "/en");

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage.closest("a")).toHaveAttribute("href", "/en");
  });

  it("renders cart icon with aria-label", () => {
    render(<MobileMenuSidebar />);

    const cartLink = screen.getByRole("button", { name: /cart icon/i });
    expect(cartLink).toHaveAttribute("href", "/en");
  });

  it("renders search input with placeholder", () => {
    render(<MobileMenuSidebar />);
    fireEvent.click(screen.getByTestId("toggle-menu"));

    expect(screen.getByPlaceholderText("search_product")).toBeInTheDocument();
  });

  it("opens and closes mobile menu", () => {
    render(<MobileMenuSidebar />);
    const toggle = screen.getByTestId("toggle-menu");

    fireEvent.click(toggle);
    expect(screen.getByTestId("mobile-menu")).toHaveClass("animated");

    const close = screen.getByTestId("toggle-menu-closer");
    fireEvent.click(close);
    expect(screen.getByTestId("mobile-menu")).not.toHaveClass("animated");
  });

  it("toggles categories dropdown", async () => {
    render(<MobileMenuSidebar />);
    fireEvent.click(screen.getByTestId("toggle-menu"));

    const categoriesBtn = screen.getByText(/categories/i);
    fireEvent.click(categoriesBtn);

    expect(screen.getByText("Category1")).toBeVisible();

    fireEvent.click(categoriesBtn);
    expect(screen.queryByText("Category1")).not.toBeVisible();
  });

  it("toggles pages dropdown", () => {
    render(<MobileMenuSidebar />);
    fireEvent.click(screen.getByTestId("toggle-menu"));

    const pagesBtn = screen.getByText(/pages/i);
    fireEvent.click(pagesBtn);

    expect(screen.getByText("cart")).toBeVisible();
    expect(screen.getByText("compare_products")).toBeVisible();

    fireEvent.click(pagesBtn);
    expect(screen.getByText("cart")).not.toBeVisible();
    expect(screen.getByText("compare_products")).not.toBeVisible();
  });

  it("renders login/register links", () => {
    render(<MobileMenuSidebar />);

    expect(screen.getByRole("button", { name: /sign_in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });
});
