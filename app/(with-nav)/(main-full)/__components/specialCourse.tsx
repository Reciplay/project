"use client";

import { useRouter } from "next/navigation";
import Carousel from "@/components/carousel/carousel";
import { sampleSpecialCourse } from "@/config/sampleSpecialCourse";

export default function SpecialCourse() {
  const router = useRouter();

  return (
    <Carousel
      props={sampleSpecialCourse.map((e) => ({
        image: e.thumbnail,
        onClick: () => router.push(`/course/${e.id}`),
      }))}
    />
  );
}
