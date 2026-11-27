import ScrollToTopButton from "../scroll-to-top-button";
import { fireEvent, render, screen, waitFor } from "@tests/test-utils";

describe("ScrollToTopButton", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return setTimeout(() => cb(Date.now()), 0) as unknown as number;
    });

    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is hidden when scrollY <= 500", () => {
    render(<ScrollToTopButton />);
    fireEvent.scroll(window);

    const btn = screen.getByTestId("scroll-to-top");
    expect(btn).not.toHaveClass("active");
  });

  it("becomes visible when scrollY > 500", async () => {
    render(<ScrollToTopButton />);

    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    const btn = screen.getByTestId("scroll-to-top");

    await waitFor(() => {
      expect(btn).toHaveClass("active");
    });
  });

  it("calls window.scrollTo on click", () => {
    render(<ScrollToTopButton />);
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    const btn = screen.getByTestId("scroll-to-top");
    fireEvent.click(btn);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
