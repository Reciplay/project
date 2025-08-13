import { create } from "zustand";

export interface Certificate {
  id?: number;
  licenseName: string;
  institution: string;
  acquisitionDate: string;
  grade: number;
}

export interface Career {
  id?: number; // optional: 서버에서 부여하는 경우
  companyName: string;
  position: string;
  jobDescription: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface Profile {
  coverImage: string;
  phoneNumber: string;
  address: string;
}

export interface InstructorState {
  profile: Profile;
  introduction: string;
  certificates: Certificate[];
  careers: Career[];

  coverImageFile: File | null;

  setProfile: (_data: Partial<Profile>) => void;
  setIntroduction: (_text: string) => void;
  setCertificates: (_certs: Certificate[]) => void;
  setCareers: (_careers: Career[]) => void;
  setCoverImageFile: (_file: File | null) => void; // ✅ 추가

  addCertificate: (_cert: Certificate) => void;
  removeCertificate: (_index: number) => void;

  addCareer: (_career: Career) => void;
  removeCareer: (_index: number) => void;
}

export const useInstructorStore = create<InstructorState>((set) => ({
  introduction: "",
  certificates: [],
  careers: [],

  profile: {
    coverImage: "",
    phoneNumber: "",
    address: "",
  },

  coverImageFile: null, // ✅ 추가
  setCoverImageFile: (file) => set({ coverImageFile: file }), // ✅ 추가

  setProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data }, // ✅ 부분 업데이트 가능하도록
    })),
  setIntroduction: (text) => set({ introduction: text }),
  setCertificates: (certs) => set({ certificates: certs }),
  setCareers: (careers) => set({ careers }),

  addCertificate: (cert) =>
    set((state) => ({ certificates: [...state.certificates, cert] })),
  removeCertificate: (index) =>
    set((state) => ({
      certificates: state.certificates.filter((_, i) => i !== index),
    })),

  addCareer: (career) =>
    set((state) => ({ careers: [...state.careers, career] })),
  removeCareer: (index) =>
    set((state) => ({
      careers: state.careers.filter((_, i) => i !== index),
    })),
}));
