export interface InstructorPageRequest {
  coverImage: string;
  instructorProfile: InstructorProfile;
}

export interface InstructorProfile {
  address: string;
  phoneNumber: string;
  introduction: string;
  licenses: requestLicense[];
  careers: Career[];
}

export interface requestLicense {
  id: number;
  licenseName: string;
  institution: string;
  acquisitionDate: string; // YYYY-MM-DD
  grade: number;
}

export interface Career {
  id: number;
  companyName: string;
  position: string;
  jobDescription: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
