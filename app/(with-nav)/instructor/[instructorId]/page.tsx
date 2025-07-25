import React from "react";
import { Instructor } from "./__components/bannerProfile/bannerProfile";
import { sampleInstructors } from "@/config/sampleData";
import InstructorProfile from "./__components/InstructorProfile/InstructorProfile";

interface PageProps {
  params: {
    instructorId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { instructorId } = params;

  const instructor: Instructor = sampleInstructors[Number(instructorId)];

  return <InstructorProfile instructor={instructor} />;
}
