export interface InstructorResponse {
  status: string; // 200 or 400
  message: string;
  data: Instructor;
}

export interface Instructor {
  name: string;
  profileImage: string;
  coverImage: string;
  introduction: string;
  licenses: License[];
  careers: Career[];
  subscriberCount: number;
  isSubscribed: true;
}

export interface License {
  id: number;
  licenseName: string;
  institution: string;
  acquisitionDate: Date;
  grade: number;
}

export interface Career {
  id: number;
  companyName: string;
  position: string;
  jobDescription: string;
  startDate: Date;
  endDate: Date;
}
