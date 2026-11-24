import translations from "@/locales/en/common.json";
import { render, screen, setMessages } from "@tests/test-utils";
import MainFooter from "../main-footer";

const locale_keys: (keyof typeof translations.main_layout)[] = [
  "office",
  "useful_links",
  "account",
  "sign_in",
  "cart",
  "wish_list",
  "compare_products",
  "about",
  "contacts",
  "faq",
  "latest_products",
  "order_track",
  "newsletter",
  "enter_your_email",
  "subscribe",
  "follow_us",
  "all_rights_reserved",
];

describe("MainFooter", () => {
  beforeEach(() => {
    setMessages({});
    vi.resetAllMocks();
  });

  it("renders with correct translations when locale is en", async () => {
    setMessages(translations);
    const element = await MainFooter();
    render(element);

    locale_keys.forEach((key) => {
      expect(screen.getByText(translations.main_layout[key])).toBeInTheDocument();
    });
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "E-mail address");
  });

  it("renders all expected links with correct href", async () => {
    const element = await MainFooter();
    render(element);

    const links = screen.getAllByRole("link").map((el) => ({
      text: el.textContent?.trim(),
      href: el.getAttribute("href"),
    }));

    expect(links).toEqual(
      expect.arrayContaining([
        { text: "main_layout.account", href: "/en" },
        { text: "main_layout.sign_in", href: "/en" },
        { text: "main_layout.cart", href: "/en" },
        { text: "main_layout.wish_list", href: "/en" },
        { text: "main_layout.compare_products", href: "/en" },

        { text: "main_layout.about", href: "/en" },
        { text: "main_layout.contacts", href: "/en" },
        { text: "main_layout.faq", href: "/en" },
        { text: "main_layout.latest_products", href: "/en" },
        { text: "main_layout.order_track", href: "/en" },

        { text: "", href: "https://www.facebook.com/" },
        { text: "", href: "https://www.youtube.com/" },
        { text: "", href: "https://www.twitter.com/" },
        { text: "", href: "https://www.instagram.com/" },
      ]),
    );

    links.forEach(({ href }) => {
      expect(href).not.toBeNull();
    });
  });

  it("renders images", async () => {
    const element = await MainFooter();
    render(element);

    expect(screen.getByAltText("Footer shape")).toBeInTheDocument();
    expect(screen.getByAltText("Payment1")).toBeInTheDocument();
    expect(screen.getByAltText("Payment2")).toBeInTheDocument();
    expect(screen.getByAltText("Payment3")).toBeInTheDocument();
    expect(screen.getByAltText("Payment4")).toBeInTheDocument();
  });
});
