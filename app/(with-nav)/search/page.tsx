"use client";

import CustomCard from "@/components/card/customCard";
import ListCard from "@/components/card/listCard";
import Pagination from "@/components/pagination/pagination";
import { ROUTES } from "@/config/routes";
import { buildQuery, fetchCards } from "@/hooks/course/useCommonUtils";
import useDebounce from "@/hooks/useDebounce";
import { useWindowWidth } from "@/hooks/useWindowSize";
import { CourseCard } from "@/types/course";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") ?? "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  const [isEnrolledFilter, setIsEnrolledFilter] = useState(
    searchParams.get("isEnrolled") === "true",
  );

  const [data, setData] = useState<CourseCard[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  const width = useWindowWidth();
  const isDesktop = width > 1024;

  // Function to update URL parameters
  const updateUrlParams = useCallback(
    (newQuery: string, newIsEnrolled: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newQuery.trim()) {
        params.set("query", newQuery.trim());
      } else {
        params.delete("query");
      }
      if (newIsEnrolled) {
        params.set("isEnrolled", "true");
      } else {
        params.delete("isEnrolled");
      }
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  // Effect to update URL when debouncedSearchInput changes
  useEffect(() => {
    // Only update if debounced input is different from initial query or filter changes
    if (
      debouncedSearchInput !== initialQuery ||
      isEnrolledFilter !== (searchParams.get("isEnrolled") === "true")
    ) {
      updateUrlParams(debouncedSearchInput, isEnrolledFilter);
    }
  }, [
    debouncedSearchInput,
    isEnrolledFilter,
    initialQuery,
    searchParams,
    updateUrlParams,
  ]);

  const load = useCallback(
    (nextPage: number) => {
      const currentQuery = searchParams.get("query") ?? "";
      const currentIsEnrolled = searchParams.get("isEnrolled") === "true";

      if (!currentQuery.trim()) {
        setData([]);
        return;
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);

      const params = buildQuery(
        {
          requestCategory: "search",
          searchContent: currentQuery,
          instructorId: 0,
          isEnrolled: currentIsEnrolled,
        },
        { page: nextPage, size: 10, sort: ["createdAt,desc"] },
      );

      fetchCards(params, false, abortRef.current.signal)
        .then((res) => {
          setData(res.data.data.content);
          setTotalPages(res.data.data.totalPages ?? 0);
          setPage(res.data.data.page ?? nextPage);
        })
        .finally(() => setLoading(false));
    },
    [searchParams],
  );

  useEffect(() => {
    setPage(0);
    load(0);
  }, [searchParams, load]);

  const handlePageChange = (nextPage: number) => {
    load(nextPage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchControls}>
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            checked={isEnrolledFilter}
            onChange={(e) => setIsEnrolledFilter(e.target.checked)}
          />
          수강 중인 강좌만 보기
        </label>
      </div>
      {loading && <p className={styles.loadingText}>검색 중...</p>}
      {!loading && data.length === 0 && debouncedSearchInput.trim() && (
        <p className={styles.noResultsText}>검색 결과가 없습니다.</p>
      )}
      <div
        className={classNames({
          [styles.slide as string]: isDesktop,
          [styles.grid as string]: !isDesktop,
        })}
      >
        {data.map((course, index) =>
          isDesktop ? (
            <ListCard
              key={index}
              data={course}
              variant="horizontal"
              onClick={() =>
                router.push(ROUTES.COURSE.DETAIL(String(course.courseId)))
              }
            />
          ) : (
            <CustomCard
              key={index}
              data={course}
              onClick={() =>
                router.push(ROUTES.COURSE.DETAIL(String(course.courseId)))
              }
            />
          ),
        )}
      </div>
      {totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
