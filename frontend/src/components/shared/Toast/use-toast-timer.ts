import { useCallback, useEffect, useRef, useState } from "react";

export function useToastTimer(duration: number, onClose: () => void) {
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  const progressRef = useRef<HTMLDivElement>(null);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const startTimer = useCallback(
    (time: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const safeTime = Math.max(0, time);

      if (safeTime === 0) {
        setTimeout(triggerClose, 0);
        return;
      }

      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(triggerClose, safeTime);
    },
    [triggerClose],
  );

  useEffect(() => {
    startTimer(duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pauseTimer = () => {
    if (isClosing) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);

    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "paused";
    }
  };

  const resumeTimer = () => {
    if (isClosing || remainingRef.current <= 0) {
      if (!isClosing) triggerClose();
      return;
    }

    startTimer(remainingRef.current);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "running";
    }
  };

  return {
    isClosing,
    progressRef,
    pauseTimer,
    resumeTimer,
    triggerClose,
  };
}
