vi.unmock("@/components/shared/toast");

import { ToastProvider, useToast } from "@/components/shared/toast";
import { act, fireEvent, render, renderHook, screen } from "@tests/test-utils";

function TestComponent({
  message,
  type,
  duration,
  label = "Trigger Toast",
}: {
  message: string;
  type?: string;
  duration?: number;
  label?: string;
}) {
  const { showToast } = useToast();

  return <button onClick={() => showToast(message, type as any, duration)}>{label}</button>;
}

describe("ToastContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it("renders children inside provider", () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child</div>
      </ToastProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("shows and auto-removes toast", () => {
    render(
      <ToastProvider>
        <TestComponent duration={1000} label="Trigger Toast" message="Test Toast" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("Trigger Toast"));

    expect(screen.getByText("Test Toast")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000 + 300);
    });

    expect(screen.queryByText("Test Toast")).not.toBeInTheDocument();
  });

  it("renders multiple toasts and removes them after timeouts", () => {
    act(() => {
      render(
        <ToastProvider>
          <TestComponent duration={1000} label="Trigger A" message="Toast A" />
          <TestComponent duration={2000} label="Trigger B" message="Toast B" />
        </ToastProvider>,
      );
    });

    act(() => {
      fireEvent.click(screen.getByText("Trigger A"));
      fireEvent.click(screen.getByText("Trigger B"));
    });

    expect(screen.getByText("Toast A")).toBeInTheDocument();
    expect(screen.getByText("Toast B")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000 + 300);
    });

    expect(screen.queryByText("Toast A")).not.toBeInTheDocument();
    expect(screen.getByText("Toast B")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000 + 300);
    });

    expect(screen.queryByText("Toast B")).not.toBeInTheDocument();
  });

  it("limits the number of simultaneous toasts to 3", () => {
    render(
      <ToastProvider>
        <TestComponent label="1" message="Toast 1" />
        <TestComponent label="2" message="Toast 2" />
        <TestComponent label="3" message="Toast 3" />
        <TestComponent label="4" message="Toast 4" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("4"));

    const toasts = screen.getAllByRole("status");
    expect(toasts).toHaveLength(3);

    expect(screen.queryByText("Toast 1")).toBeNull();
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
    expect(screen.getByText("Toast 3")).toBeInTheDocument();
    expect(screen.getByText("Toast 4")).toBeInTheDocument();
  });

  it("auto-removes a toast when duration equals 0", () => {
    render(
      <ToastProvider>
        <TestComponent duration={0} label="Trigger" message="Toast" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("Trigger"));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Toast")).not.toBeInTheDocument();
  });

  it("closes toast when Close button is clicked", () => {
    render(
      <ToastProvider>
        <TestComponent duration={0} label="Trigger" message="Toast" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("Trigger"));
    fireEvent.click(screen.getByTestId("close-button"));

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("Toast")).not.toBeInTheDocument();
  });

  it("includes accessible role and live-region", () => {
    render(
      <ToastProvider>
        <TestComponent duration={0} label="Trigger" message="Toast" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText("Trigger"));
    const toast = screen.getByRole("status");

    expect(toast).toHaveAttribute("aria-live", "polite");
    expect(toast).toHaveTextContent("Toast");
  });

  it("throws if useToast is used outside of provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useToast())).toThrow("useToast must be used within a ToastProvider");

    spy.mockRestore();
  });
});
