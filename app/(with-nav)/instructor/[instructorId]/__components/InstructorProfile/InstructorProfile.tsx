"use client";

import React, { useRef } from "react";
import ScrollTabs from "@/components/tab/scrollTabs";
import BannerProfile, { Instructor } from "../bannerProfile/bannerProfile";
import Career from "../career/career";
import Qualifications from "../qualifications/qualifications";
import Category from "../category/category";
import Classes from "../classes/classes";

import BannerImage from "@/components/image/bannerImage";

interface InstructorProfileProps {
  instructor: Instructor;
}

export default function InstructorProfile({
  instructor,
}: InstructorProfileProps) {
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const tabTitles: string[] = ["경력", "자격증", "카테고리", "수강중인 클래스"];

  const careerList = [
    "서울 리츠칼튼 호텔",
    "미국 리츠칼튼 센프란시스코",
    "W호텔 부총주방장 (2004)",
    "중국 텐진 쉐라튼 그랜드 호텔 총주방장 (2005)",
    "두바이 페어몬트 호텔 수석총괄주방장 (2006)",
    "두바이 버즈 알 이랍 호텔 수석총괄주방장 (2007~2009)",
    "서울현대전문학교 외식산업계열 학장 (2013.09~)",
  ];
  const certifications: string[] = [
    "한식조리기능사",
    "양식조리기능사",
    "중식조리기능사",
    "일식조리기능사",
    "복어조리기능사",
    "조리산업기사 (한식)",
    "조리기능장",
    "HACCP 팀장교육 수료증",
    "ServSafe Manager Certification (미국)",
    "WACS 국제조리사 자격증",
  ];
  return (
    <div>
      <BannerImage imageUrl="/images/instructor-banner.png" />
      <BannerProfile instructorThumbnail={instructor.thumbnail} />
      <ScrollTabs sectionRefs={sectionRefs} tabTitles={tabTitles} />
      <Career ref={sectionRefs[0]} items={careerList} />
      <Qualifications ref={sectionRefs[1]} items={certifications} />
      <Category ref={sectionRefs[2]} />
      <Classes ref={sectionRefs[3]} />
    </div>
  );
}
