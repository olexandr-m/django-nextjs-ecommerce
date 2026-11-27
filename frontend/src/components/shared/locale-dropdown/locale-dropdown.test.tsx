import LocaleDropdown from "./locale-dropdown";
import { fireEvent, render, screen, replace } from "@tests/test-utils";

vi.mock("@heroicons/react/24/solid", () => ({
  ChevronDownIcon: () => <span data-testid="chevron" />,
}));

describe("LocaleDropdown", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });
  });

  it("renders current locale flag and label", () => {
    render(<LocaleDropdown />);
    // expect(screen.getByText("🇺🇸")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("opens dropdown when button is clicked", () => {
    render(<LocaleDropdown />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("UK")).toBeInTheDocument();
  });

  it("switch locale when dropdown locale is clicked", () => {
    render(<LocaleDropdown />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("UK"));

    expect(replace).toHaveBeenCalledWith("/test-path", { locale: "uk" });
  });

  it("closes dropdown when clicking outside", () => {
    render(<LocaleDropdown />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects locale using the Enter key", () => {
    render(<LocaleDropdown />);

    fireEvent.click(screen.getByRole("button"));

    const ukOption = screen.getByText("UK");
    fireEvent.keyDown(ukOption, { key: "Enter", code: "Enter" });

    expect(replace).toHaveBeenCalledWith("/test-path", { locale: "uk" });
  });

  it("closes the dropdown when pressing the Escape key", () => {
    render(<LocaleDropdown />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
