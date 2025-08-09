"use client";

import BannerImage from "@/components/image/coverImage";
import ScrollTabs from "@/components/tab/scrollTabs";
import { Instructor } from "@/types/instructor";
import { useEffect, useMemo, useRef, useState } from "react";
import BannerProfile from "../bannerProfile/bannerProfile";
import Careers from "../careers/careers";
import Courses from "../courses/courses";
import Licenses from "../licenses/licenses";
import styles from "./instructorProfile.module.scss";

interface InstructorProfileProps {
  instructor: Instructor;
}

export default function InstructorProfile({
  instructor,
}: InstructorProfileProps) {
  const careerRef = useRef<HTMLElement | null>(null);
  const licenseRef = useRef<HTMLElement | null>(null);
  const coursesRef = useRef<HTMLElement | null>(null);

  const sectionRefs = useMemo(() => [careerRef, licenseRef, coursesRef], []);

  const tabTitles = ["경력", "자격증", "강좌목록"];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const sections = sectionRefs
      .map((r) => r.current!)
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // 화면에 가장 많이 보이는 섹션을 active로 선택
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const idx = sections.findIndex((s) => s === visible.target);
          if (idx !== -1) setActiveIdx(idx);
        }
      },
      {
        // 상단에 고정된 헤더/탭 높이에 맞춰 보정 (필요시 숫자 조정)
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [sectionRefs]);

  const handleScrollTo = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={styles.container}>
      <BannerImage props={{ image: instructor.coverImage }} />

      <BannerProfile
        props={{
          profile: instructor.profileImage ?? "/images/default_profile.jpg",
          name: instructor.name,
          jobDescription: instructor.careers?.[0]?.jobDescription ?? "",
          companyName: instructor.careers?.[0]?.companyName ?? "",
        }}
      />

      <ScrollTabs
        tabTitles={tabTitles}
        activeIdx={activeIdx}
        onClickTab={handleScrollTo}
      />

      <div className={styles.content}>
        <section ref={sectionRefs[0]}>
          <Careers careers={instructor.careers} />
        </section>

        <section ref={sectionRefs[1]}>
          <Licenses licenses={instructor.licenses} />
        </section>

        <section ref={sectionRefs[2]}>
          <Courses />
        </section>
      </div>
    </div>
  );
}
