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
  licenseId: number;
  licenseName: string;
  institution: string;
  acquisitionDate: string; // YYYY-MM-DD
  grade: string;
}

export interface Career {
  careerId: number;
  companyName: string;
  position: string;
  jobDescription: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
