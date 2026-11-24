"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { ToastVariant, useToastTimer } from "./";
import styles from "./toast.module.css";

interface Props {
  message: string;
  type: ToastVariant;
  duration: number;
  onClose: () => void;
}

export function Toast({ message, type, duration, onClose }: Props) {
  const { isClosing, progressRef, pauseTimer, resumeTimer, triggerClose } = useToastTimer(duration, onClose);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isClosing ? styles.animateOut : styles.animateIn}`}
      data-testid="toast-container"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <span className={styles.message} aria-live="polite" role="status">
        {message}
      </span>
      <button className={styles.closeBtn} data-testid="close-button" onClick={triggerClose}>
        <XCircleIcon className={styles.icon} />
      </button>

      {/* Progress Bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          data-testid="progress-bar"
          ref={progressRef}
          style={{
            animation: `${styles["toast-shrink"]} ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
