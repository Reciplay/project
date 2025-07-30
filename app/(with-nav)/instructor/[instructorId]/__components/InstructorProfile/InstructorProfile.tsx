"use client";

import ScrollTabs from "@/components/tab/scrollTabs";
import { useRef } from "react";
import Classes from "../classes/classes";

import BannerImage from "@/components/image/coverImage";
import { Instructor } from "@/types/instructor";
import BannerProfile from "../bannerProfile/bannerProfile";
import Careers from "../career/career";
import Licenses from "../licenses/licenses";

interface InstructorProfileProps {
  props: Instructor;
}

export default function InstructorProfile({ props }: InstructorProfileProps) {
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const tabTitles: string[] = ["경력", "자격증", "수강중인 클래스"];

  return (
    <div>
      <BannerImage props={{ image: props.coverImage }} />
      <BannerProfile
        props={{
          profile: props.profileImage,
          name: props.name,
          jobDescription: props.careers[0].jobDescription,
          companyName: props.careers[0].companyName,
        }}
      />
      <ScrollTabs sectionRefs={sectionRefs} tabTitles={tabTitles} />
      <Careers ref={sectionRefs[0]} props={props.careers} />
      <Licenses ref={sectionRefs[1]} props={props.licenses} />
      <Classes ref={sectionRefs[2]} />
    </div>
  );
}
