"use client";

import CustomCard from "@/components/card/customCard";
import { CARDTYPE } from "@/types/card";
import type { CourseCard } from "@/types/course";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./netflixGrid.module.scss";

type NetflixGridProps<T> = {
  title?: string;
  items: T[];
  gapRem?: number; // 아이템 간격 (rem)
  className?: string;
  loading?: boolean;
  renderItem?: (item: T, index: number) => React.ReactNode;
  onSeeAll?: () => void;
  seeAllLabel?: string;
};

export default function NetflixGrid({
  title,
  items,
  gapRem = 1.25, // CustomGrid와 동일 기본 간격
  className,
  loading = false,
  renderItem,
  onSeeAll,
  seeAllLabel = "전체보기",
}: NetflixGridProps<CourseCard>) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const evaluate = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    // 패딩 반영 (px 숫자 뽑기)
    const style = getComputedStyle(el);
    const padL = parseFloat(style.paddingLeft || "0") || 0;
    const padR = parseFloat(style.paddingRight || "0") || 0;

    // 한 화면에 다 보이는지 (패딩을 고려한 실제 컨텐츠 폭)
    const contentWidth = scrollWidth - padL - padR;
    const fitsInOne = contentWidth <= clientWidth + 1;

    // 부동소수점 오차 보정
    const EPS = 1;

    const atStart = scrollLeft <= padL + EPS;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - padR - EPS;

    setCanPrev(!fitsInOne && !atStart);
    setCanNext(!fitsInOne && !atEnd);
  }, []);

  useEffect(() => {
    evaluate();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => evaluate();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => evaluate());
    ro.observe(el);

    // 레이아웃/이미지 로드 안정화 후 한번 더
    requestAnimationFrame(() => {
      evaluate();
      setTimeout(evaluate, 0);
    });

    // 이미지가 늦게 로드될 때도 재평가
    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!(img as HTMLImageElement).complete) {
        img.addEventListener("load", evaluate);
        img.addEventListener("error", evaluate);
      }
    });

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      imgs.forEach((img) => {
        img.removeEventListener("load", evaluate);
        img.removeEventListener("error", evaluate);
      });
    };
  }, [evaluate, items.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.95, behavior: "smooth" });
  };

  const showLeftUI = canPrev;
  const showRightUI = canNext;

  // ✅ 빈 상태 판단
  const isEmpty = !loading && (!items || items.length === 0);

  return (
    <section className={classNames(styles.wrap, className)}>
      {(title || onSeeAll) && (
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {onSeeAll && (
            <button type="button" className={styles.seeAll} onClick={onSeeAll}>
              {seeAllLabel}
            </button>
          )}
        </header>
      )}
      {/* 
      <div className={styles.stage}>
        {showLeftUI && (
          <>
            <i
              className={classNames(styles.fade, styles.leftFade, styles.show)}
            />
            <button
              type="button"
              aria-label="이전"
              className={classNames(styles.navBtn, styles.prev)}
              onClick={() => scrollByPage(-1)}
            >
              ‹
            </button>
          </>
        )}

        {showRightUI && (
          <>
            <i
              className={classNames(styles.fade, styles.rightFade, styles.show)}
            />
            <button
              type="button"
              aria-label="다음"
              className={classNames(styles.navBtn, styles.next)}
              onClick={() => scrollByPage(1)}
            >
              ›
            </button>
          </>
        )}

        <div
          ref={scrollerRef}
          className={styles.scroller}
          style={
            {
              "--lane-gap": `${gapRem}rem`,
              "--card-w-px": "251.34px",
              "--card-h-px": "334.8px",
            } as React.CSSProperties
          }
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.item} />
              ))
            : items.map((it, i) => (
                <div key={i} className={styles.item}>
                  {renderItem ? (
                    renderItem(it, i)
                  ) : (
                    <CustomCard data={it} type={CARDTYPE.VERTICAL} />
                  )}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
} */}
      {/* ✅ 빈 상태 UI */}
      {isEmpty ? (
        <div
          className={styles.emptyWrap}
          role="region"
          aria-label="빈 강좌 영역"
        >
          <div className={styles.emptyTexts}>
            <h4 className={styles.emptyTitle}>수강 중인 강좌가 없어요</h4>
            <p className={styles.emptyDesc}>
              관심 있는 강좌를 찾아 시작해보세요. 꾸준히 들으면 성장 곡선이 확
              달라져요!
            </p>
          </div>
          <div className={styles.emptyActions}></div>
        </div>
      ) : (
        // ✅ 기존 가로 스크롤 레일
        <div className={styles.stage}>
          {showLeftUI && (
            <>
              <i
                className={classNames(
                  styles.fade,
                  styles.leftFade,
                  styles.show,
                )}
              />
              <button
                type="button"
                aria-label="이전"
                className={classNames(styles.navBtn, styles.prev)}
                onClick={() => scrollByPage(-1)}
              >
                ‹
              </button>
            </>
          )}

          {showRightUI && (
            <>
              <i
                className={classNames(
                  styles.fade,
                  styles.rightFade,
                  styles.show,
                )}
              />
              <button
                type="button"
                aria-label="다음"
                className={classNames(styles.navBtn, styles.next)}
                onClick={() => scrollByPage(1)}
              >
                ›
              </button>
            </>
          )}

          <div
            ref={scrollerRef}
            className={styles.scroller}
            style={
              {
                "--lane-gap": `${gapRem}rem`,
                "--card-w-px": "251.34px",
                "--card-h-px": "334.8px",
              } as React.CSSProperties
            }
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={styles.item} />
                ))
              : items.map((it, i) => (
                  <div key={i} className={styles.item}>
                    {renderItem ? (
                      renderItem(it, i)
                    ) : (
                      <CustomCard data={it} type={CARDTYPE.VERTICAL} />
                    )}
                  </div>
                ))}
          </div>
        </div>
      )}
    </section>
  );
}
