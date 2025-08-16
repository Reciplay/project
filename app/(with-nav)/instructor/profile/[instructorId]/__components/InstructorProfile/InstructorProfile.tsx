"use client";

import BannerImage from "@/components/image/coverImage";
import ScrollTabs from "@/components/tab/scrollTabs";
import { useScrollTabs } from "@/hooks/useScrollTabs";
import { Instructor } from "@/types/instructor";
import BannerProfile from "../bannerProfile/bannerProfile";
import Careers from "../careers/careers";
import Courses from "../courses/courses";
import Licenses from "../licenses/licenses";
import styles from "./instructorProfile.module.scss";
import { useContext } from "react";
import { ScrollContainerContext } from "@/contexts/ScrollContainerContext";

interface InstructorProfileProps {
  instructor: Instructor;
  instructorId: string;
}

export default function InstructorProfile({
  instructor,
  instructorId,
}: InstructorProfileProps) {
  const tabTitles = ["경력", "자격증", "강좌목록"];

  const mainRef = useContext(ScrollContainerContext);

  const { activeIdx, handleScrollTo, sectionRefs } = useScrollTabs(
    tabTitles.length,
    { scrollContainerRef: mainRef },
  );

  return (
    <div className={styles.container}>
      <BannerImage props={{ image: instructor.coverImage }} />

      <BannerProfile
        props={{
          profile: instructor.profileImage ?? "/images/default_profile.jpg",
          name: instructor.name,
          jobDescription: instructor.careers?.[0]?.jobDescription ?? "",
          companyName: instructor.careers?.[0]?.companyName ?? "",
          // 이거 있나..?
          isSubscribed: instructor.isSubscribed,
          instructorId: Number(instructorId),
        }}
      />

      <div className={`${styles.tab}`}>
        <ScrollTabs
          tabTitles={tabTitles}
          activeIdx={activeIdx}
          onClickTab={handleScrollTo}
        />
      </div>

      <div className={styles.content}>
        <section ref={sectionRefs[0]} className={styles.section}>
          <Careers careers={instructor.careers} />
        </section>

        <section ref={sectionRefs[1]} className={styles.section}>
          <Licenses licenses={instructor.licenses} />
        </section>

        <section ref={sectionRefs[2]} className={styles.section}>
          <Courses />
        </section>
      </div>
    </div>
  );
}
