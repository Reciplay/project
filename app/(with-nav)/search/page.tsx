"use client";

import ListCard from "@/components/card/listCard";
import { buildQuery, fetchCards } from "@/hooks/course/useCommonUtils";
import { CourseCard } from "@/types/course";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
// import Card from "@/components/card/card";
// import { sampleCourse1 } from "@/config/sampleCourse";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const [data, setData] = useState<CourseCard[]>([]);
  const [, setPage] = useState<number>(0);
  const [, setTotalPages] = useState<number>(0);
  const [, setLoading] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);
  const load = useCallback(
    (nextPage: number) => {
      if (!query.trim()) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);

      const params = buildQuery(
        {
          requestCategory: "search",
          searchContent: query,
          instructorId: 0,
          isEnrolled: true,
        },
        { page: 0, size: 1, sort: ["createdAt,desc"] },
      );

      fetchCards(params, false, abortRef.current.signal)
        .then((res) => {
          setData(res.data.data.content);
          setTotalPages(res.data.data.totalPages ?? 0);
          setPage(res.data.data.page ?? nextPage);
        })
        .finally(() => setLoading(false));
    },
    [query],
  );

  useEffect(() => {
    setPage(0);
    load(0);
  }, [query, load]);

  return (
    <div className={styles.container}>
      <div className={styles.slide}>
        {data.map((course, index) => (
          <ListCard key={index} data={course} variant="horizontal" />
          // <Card key={index} data={course} type={CARDTYPE.HORIZONTAL} />
        ))}
      </div>
    </div>
  );
}
