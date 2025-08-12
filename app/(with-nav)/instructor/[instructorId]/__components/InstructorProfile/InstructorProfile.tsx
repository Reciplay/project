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

interface InstructorProfileProps {
  instructor: Instructor;
}

export default function InstructorProfile({
  instructor,
}: InstructorProfileProps) {
  const tabTitles = ["경력", "자격증", "강좌목록"];
  const { activeIdx, handleScrollTo, sectionRefs } = useScrollTabs(
    tabTitles.length
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
