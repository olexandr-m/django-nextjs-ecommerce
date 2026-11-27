"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isOverThreshold = window.scrollY > 500;
      setShowScrollToTop((prev) => (prev !== isOverThreshold ? isOverThreshold : prev));
    };

    const throttled = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttled);
    return () => window.removeEventListener("scroll", throttled);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a
        className={clsx("scrollToTop", {
          active: showScrollToTop,
        })}
        aria-label="Scroll to top"
        data-testid="scroll-to-top"
        onClick={scrollToTop}
      >
        <i className="flaticon-up-arrow"></i>
      </a>
    </>
  );
}
