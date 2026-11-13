import LocaleLayout, { metadata, viewport } from "@/app/[locale]/layout";
import { render, screen, setMessages } from "@tests/test-utils";

vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(async ({ locale }: { locale: string }) => ({})),
}));

describe("LocaleLayout (Server Component)", () => {
  beforeEach(() => {
    setMessages({});
  });

  it("renders children correctly", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const children = <div data-testid="child">Test Child</div>;
    const result = await LocaleLayout({ params: Promise.resolve({ locale: "en" }), children });

    render(result);

    expect(screen.getByTestId("child")).toHaveTextContent("Test Child");

    consoleSpy.mockRestore();
  });

  it("exports correct metadata and viewport", () => {
    expect(metadata.title).toBe("E-commerce");

    expect(viewport.width).toBe("device-width");
    expect(viewport.initialScale).toBe(1);
  });

  it("receives the correct locale param", async () => {
    const locale = "en";
    const layout = await LocaleLayout({ params: Promise.resolve({ locale: "en" }), children: <div /> });

    expect(layout.props.lang ?? layout.props?.children?.props?.lang).toBe(locale);
  });

  it("calls getMessages with the correct locale", async () => {
    const children = <div>Test Child</div>;
    await LocaleLayout({ params: Promise.resolve({ locale: "uk" }), children });

    const { getMessages } = await import("next-intl/server");
    expect(getMessages).toHaveBeenCalledWith({ locale: "uk" });
  });
});
