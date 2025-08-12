// // app/admin/hooks/useMemberList.ts
// import { useState, useEffect } from "react";
// import restClient from "@/lib/axios/restClient";
// import { ApiResponse } from "@/types/apiResponse";
// import { UserDetail, UserSummary } from "@/types/user";

// export default function useMemberList() {
//   const [members, setMembers] = useState<UserSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selected, setSelected] = useState<UserDetail | null>(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await restClient.get<ApiResponse<UserSummary[]>>(
//           "/api/v1/course/admin/user/summaries"
//         );
//         setMembers(res.data.data);
//       } catch {
//         setMembers(sampleMembers);
//         // setError("서버 연결에 실패했습니다. (샘플 데이터 표시 중)");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const openModal = async (userId: number) => {
//     setModalOpen(true);
//     setDetailLoading(true);
//     try {
//       const res = await restClient.get<ApiResponse<UserDetail>>(
//         "/api/v1/course/admin/user",
//         { params: { userId } }
//       );
//       setSelected(res.data.data);
//     } catch {
//       setSelected(sampleMemberDetail);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelected(null);
//   };

//   return {
//     members,
//     loading,
//     error,
//     modalOpen,
//     selected,
//     detailLoading,
//     openModal,
//     closeModal,
//   };
// }
