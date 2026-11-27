import StickyNavbar from "../sticky-navbar";
import translations from "@/locales/en/common.json";
import { fireEvent, render, screen, setMessages, waitFor } from "@tests/test-utils";

const locale_keys: (keyof typeof translations.main_layout)[] = [
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

describe("StickyNavbar", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return setTimeout(() => cb(Date.now()), 0) as unknown as number;
    });

    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });

    setMessages({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with correct translations when locale is en", () => {
    setMessages(translations.main_layout);
    render(<StickyNavbar />);

    locale_keys.forEach((key) => {
      expect(screen.getAllByText(translations.main_layout[key])[0]).toBeInTheDocument();
    });
  });

  it("renders all expected links with correct href", () => {
    render(<StickyNavbar />);

    expect(screen.getByRole("link", { name: "home" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "shop" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "about" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "contacts" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "faq" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "order_track" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "my_account" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "blog" })).toHaveAttribute("href", "/en");
  });

  it("renders logo as a link with image", () => {
    render(<StickyNavbar />);

    const logoLink = screen.getByRole("link", { name: /logo/i });
    expect(logoLink).toHaveAttribute("href", "/en");

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage.closest("a")).toHaveAttribute("href", "/en");
  });

  it("is hidden initially", () => {
    render(<StickyNavbar />);

    const navbar = screen.getByTestId("sticky-navbar");
    expect(navbar).not.toHaveClass("animated fadeInDown fixed");
  });

  it("becomes sticky when scrollY > 500", async () => {
    render(<StickyNavbar />);
    const navbar = screen.getByTestId("sticky-navbar");

    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navbar).toHaveClass("animated fadeInDown fixed");
    });
  });

  it("removes sticky when scrollY < 500 again", async () => {
    render(<StickyNavbar />);
    const navbar = screen.getByTestId("sticky-navbar");

    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navbar).toHaveClass("animated fadeInDown fixed");
    });

    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navbar).not.toHaveClass("animated fadeInDown fixed");
    });
  });
});
