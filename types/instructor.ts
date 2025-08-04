export interface Instructor {
  id: string;
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
  acquisitionDate: string;
  grade: string;
}

export interface Career {
  id: number;
  companyName: string;
  position: string;
  jobDescription: string;
  startDate: string;
  endDate: string;
}

export interface InstructorSummary {
  instructorId: number;
  name: string;
  email: string;
  registeredAt: string;
}

export interface InstructorDetail {
  instructorId: number;
  name: string;
  email: string;
  registeredAt: string; // ISO string
  nickName: string;
  birthDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  introduction: string;
  address: string;
  phoneNumber: string;
  licenses: {
    name: string;
    institution: string;
    acquisitionDate: string;
    grade: string;
  }[];
  careers: {
    companyName: string;
    position: string;
    jobDescription: string;
    startDate: string;
    endDate: string;
  }[];
}
