"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Options = {
  rootMargin?: string;
  thresholds?: number[];
  scrollBehavior?: ScrollBehavior;
  scrollBlock?: ScrollLogicalPosition;
};

export function useScrollTabs(
  count: number,
  {
    rootMargin = "-80px 0px -60% 0px",
    thresholds = [0.2, 0.4, 0.6, 0.8],
    scrollBehavior = "smooth",
    scrollBlock = "start",
  }: Options = {}
) {
  // 섹션 DOM 보관
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);

  // 각 인덱스에 대응하는 callback ref
  const getSectionRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionsRef.current[index] = el;
    },
    []
  );

  // 고정된 길이의 ref 바인더 배열 (의존성 안전)
  const sectionRefs = useMemo(
    () => Array.from({ length: count }, (_, i) => getSectionRef(i)),
    [count, getSectionRef]
  );

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const nodes = sectionsRef.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = nodes.findIndex((n) => n === visible.target);
          if (idx !== -1) setActiveIdx(idx);
        }
      },
      { rootMargin, threshold: thresholds }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [rootMargin, thresholds, count]);

  const handleScrollTo = useCallback(
    (index: number) => {
      const node = sectionsRef.current[index];
      node?.scrollIntoView({ behavior: scrollBehavior, block: scrollBlock });
    },
    [scrollBehavior, scrollBlock]
  );

  return {
    activeIdx,
    handleScrollTo,
    // JSX에서 섹션에 바로 ref로 꽂기
    sectionRefs, // Array<(el: HTMLElement | null) => void>
  };
}
