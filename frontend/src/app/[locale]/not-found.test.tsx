import NotFound, { generateMetadata } from "@/app/[locale]/not-found";
import translations_en from "@/locales/en/common.json";
import { render, screen, setMessages } from "@tests/test-utils";

describe("NotFound Page", () => {
  beforeEach(() => {
    setMessages({});
    vi.resetAllMocks();
  });

  it("renders correct translations with default locale", async () => {
    setMessages(translations_en.not_found);

    const element = await NotFound();
    render(element);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Page Not Found");
    expect(screen.getByText("Sorry, the page you are looking for could not be found.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to main page" })).toBeInTheDocument();
  });

  it("renders fallback when translations are empty", async () => {
    const element = await NotFound();
    render(element);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("title");
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "go_home" })).toBeInTheDocument();
  });

  it("redirects button with correct href", async () => {
    const element = await NotFound();
    render(element);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("href", "/en");
  });

  it("generates correct metadata", async () => {
    setMessages(translations_en.not_found);
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: "404 | Page Not Found",
      description: "Page not found. Please check the URL or return to the homepage.",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
