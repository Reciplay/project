import { set } from 'lodash';
import { create } from 'zustand'

interface Certificate {
  id?: number;
  licenseName: string;
  institution: string;
  acquisitionDate: string;
  grade: number;
}

interface Career {
  id?: number; // optional: 서버에서 부여하는 경우
  companyName: string;
  position: string;
  jobDescription: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

interface Profile {
  coverImage: string;
  phoneNumber: string;
  address: string;
}

interface InstructorState {
  profile: Profile;
  introduction: string;
  certificates: Certificate[];
  careers: Career[];

  setProfile: (data: Partial<Profile>) => void;
  setIntroduction: (text: string) => void;
  setCertificates: (certs: Certificate[]) => void;
  setCareers: (careers: Career[]) => void;
}

export const useInstructorStore = create<InstructorState>((set) => ({
  introduction: '',
  certificates: [],
  careers: [],

  profile: {
    coverImage: '',
    phoneNumber: '',
    address: '',
  },
  setProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data }, // ✅ 부분 업데이트 가능하도록
    })),
  setIntroduction: (text) => set({ introduction: text }),
  setCertificates: (certs) => set({ certificates: certs }),
  setCareers: (careers) => set({ careers }),
}));