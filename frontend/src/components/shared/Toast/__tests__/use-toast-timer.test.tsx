import { useToastTimer } from "@/components/shared/toast/use-toast-timer";
import { act, renderHook } from "@tests/test-utils";

describe("useToastTimer", () => {
  const duration = 3000;
  const onClose = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useToastTimer(duration, onClose));

    expect(result.current.isClosing).toBe(false);
    expect(result.current.progressRef.current).toBeNull();
  });

  it("should trigger onClose after duration + animation delay", () => {
    renderHook(() => useToastTimer(duration, onClose));

    act(() => {
      vi.advanceTimersByTime(duration);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should pause the timer", () => {
    const { result } = renderHook(() => useToastTimer(duration, onClose));

    act(() => {
      vi.advanceTimersByTime(2000);
      result.current.pauseTimer();
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should resume the timer from the remaining time", () => {
    const { result } = renderHook(() => useToastTimer(duration, onClose));

    act(() => {
      vi.advanceTimersByTime(2000);
      result.current.pauseTimer();
    });

    act(() => {
      result.current.resumeTimer();
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3300);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should handle triggerClose", () => {
    const { result } = renderHook(() => useToastTimer(duration, onClose));

    act(() => {
      result.current.triggerClose();
    });
    expect(result.current.isClosing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("should not resume if already closing", () => {
    const { result } = renderHook(() => useToastTimer(duration, onClose));

    act(() => {
      result.current.triggerClose();
      result.current.resumeTimer();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should clean up timers on unmount", () => {
    const { unmount } = renderHook(() => useToastTimer(duration, onClose));

    unmount();

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should handle 0 duration correctly", () => {
    renderHook(() => useToastTimer(0, onClose));

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalled();
  });
});
