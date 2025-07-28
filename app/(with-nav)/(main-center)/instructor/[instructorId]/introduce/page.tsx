import React from "react";
import { sampleInstructors } from "@/config/sampleData";
import InstructorProfile from "./__components/InstructorProfile/InstructorProfile";
import { Instructor } from "./__components/bannerProfile/bannerProfile";

interface PageProps {
  params: {
    instructorId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { instructorId } = await params;
  // const { instructorId } = params;
  const instructor: Instructor = sampleInstructors[Number(instructorId)];

  return <InstructorProfile instructor={instructor} />;
}
