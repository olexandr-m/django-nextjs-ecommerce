vi.unmock("@/components/shared/Toast");

import { Toast } from "@/components/shared/Toast";
import styles from "@/components/shared/Toast/Toast.module.css";
import { act, fireEvent, render, screen } from "@tests/test-utils";

const DEFAULT_PROPS = {
  message: "Test Message",
  type: "success" as const,
  duration: 5000,
  onClose: vi.fn(),
};

describe("Toast Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering & Appearance", () => {
    it("renders the message with correct accessibility attributes", () => {
      render(<Toast {...DEFAULT_PROPS} />);

      const message = screen.getByText(DEFAULT_PROPS.message);
      expect(message).toBeInTheDocument();
      expect(message).toHaveAttribute("aria-live", "polite");
      expect(message).toHaveAttribute("role", "status");
    });

    it("applies the correct CSS module classes for the toast type", () => {
      render(<Toast {...DEFAULT_PROPS} type="error" />);

      const container = screen.getByTestId("toast-container");
      expect(container.className).toContain(styles.toast);
      expect(container.className).toContain(styles.error);
      expect(container.className).toContain(styles.animateIn);
    });

    it("sets the progress bar animation duration based on props", () => {
      const duration = 3000;
      render(<Toast {...DEFAULT_PROPS} duration={duration} />);

      const progressBar = screen.getByTestId("progress-bar");

      expect(progressBar.style.animation).toContain(`${duration}ms`);
    });
  });

  describe("Timer Logic & User Interaction", () => {
    it("automatically calls onClose after duration plus exit animation time", async () => {
      render(<Toast {...DEFAULT_PROPS} duration={1000} />);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const container = screen.getByTestId("toast-container");
      expect(container.className).toContain(styles.animateOut);
      expect(DEFAULT_PROPS.onClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(DEFAULT_PROPS.onClose).toHaveBeenCalledTimes(1);
    });

    it("pauses the timer on mouse enter and resumes on mouse leave", () => {
      render(<Toast {...DEFAULT_PROPS} duration={5000} />);
      const container = screen.getByTestId("toast-container");
      const progressBar = screen.getByTestId("progress-bar");

      fireEvent.mouseEnter(container);
      expect(progressBar.style.animationPlayState).toBe("paused");

      fireEvent.mouseLeave(container);
      expect(progressBar.style.animationPlayState).toBe("running");
    });

    it("closes immediately (with animation) when the close button is clicked", () => {
      render(<Toast {...DEFAULT_PROPS} />);

      const closeBtn = screen.getByTestId("close-button");
      fireEvent.click(closeBtn);

      const container = screen.getByTestId("toast-container");
      expect(container.className).toContain(styles.animateOut);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(DEFAULT_PROPS.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles 0ms duration by closing immediately", () => {
      render(<Toast {...DEFAULT_PROPS} duration={0} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(DEFAULT_PROPS.onClose).toHaveBeenCalledTimes(1);
    });

    it("cleans up timers on unmount to prevent memory leaks", () => {
      const { unmount } = render(<Toast {...DEFAULT_PROPS} duration={5000} />);

      unmount();

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      expect(DEFAULT_PROPS.onClose).not.toHaveBeenCalled();
    });
  });
});
