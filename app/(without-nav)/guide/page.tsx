// "use client";

// import { useEffect, useRef } from "react";

// /**
//  * ✅ CSS는 전역에서만 import 가능 (App Router 규칙)
//  * 아래 한 줄을 app/globals.css 등 전역 CSS에 추가하세요:
//  *
//  *   @import "fullpage.js/dist/fullpage.css";
//  *
//  * 또는 레이아웃에서 <link>로 불러도 됩니다.
//  */

// export default function FullpageDemo() {
//   // 인스턴스/컨테이너/비디오 refs
//   const fpInstance = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const videoRefs = useRef<HTMLVideoElement[]>([]);

//   // ref 주입 헬퍼
//   const setVideoRef = (idx: number) => (el: HTMLVideoElement | null) => {
//     if (el) videoRefs.current[idx] = el;
//     else delete videoRefs.current[idx];
//   };

//   useEffect(() => {
//     // SSR 회피 + 컨테이너 확인
//     if (typeof window === "undefined" || !containerRef.current) return;

//     let mounted = true;

//     (async () => {
//       // ✅ 클라이언트에서만 동적 import (여기서 window 접근 허용)
//       const Fullpage = (await import("fullpage.js")).default;

//       if (!mounted) return;

//       fpInstance.current = new Fullpage(containerRef.current, {
//         licenseKey: "YOUR_KEY_IF_NEEDED",
//         navigation: true,
//         scrollingSpeed: 700,
//         responsiveWidth: 768,
//         anchors: ["intro", "demo1", "demo2", "outro"],

//         afterLoad: (_origin, destination) => {
//           const index = destination.index as number;
//           const v = videoRefs.current[index];
//           if (v) {
//             v.muted = true;
//             v.playsInline = true;
//             v.play().catch(() => {});
//           }
//         },

//         onLeave: (origin) => {
//           const index = origin.index as number;
//           const v = videoRefs.current[index];
//           if (v) v.pause();
//         },
//       });

//       // 첫 섹션 비디오 보장 재생
//       setTimeout(() => {
//         const v = videoRefs.current[0];
//         if (v) {
//           v.muted = true;
//           v.playsInline = true;
//           v.play().catch(() => {});
//         }
//       }, 0);
//     })();

//     return () => {
//       mounted = false;
//       if (fpInstance.current) {
//         // ✅ destroy 인자: "all" | "active" (문서 기준)
//         try {
//           fpInstance.current.destroy("all");
//         } catch {}
//         fpInstance.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div id="fullpage" ref={containerRef}>
//       {/* Section 0 */}
//       <div className="section" data-anchor="intro">
//         <div className="hero">
//           <h1>Reciplay</h1>
//           <p>제스처로 즐기는 실시간 요리 클래스</p>
//           <span className="hint">스크롤하여 데모 보기 ↓</span>
//         </div>
//       </div>

//       {/* Section 1 */}
//       <div className="section" data-anchor="demo1">
//         <div className="video-wrap">
//           <video
//             ref={setVideoRef(1)}
//             preload="none"
//             playsInline
//             muted
//             controls={false}
//             src="/videos/instructor_ok_gesture.mp4"
//             poster="/images/poster_ok.jpg"
//           />
//           <div className="caption">OK 제스처로 단계 완료</div>
//         </div>
//       </div>

//       {/* Section 2 */}
//       <div className="section" data-anchor="demo2">
//         <div className="video-wrap">
//           <video
//             ref={setVideoRef(2)}
//             preload="none"
//             playsInline
//             muted
//             controls={false}
//             src="/videos/timer_and_todo.mp4"
//             poster="/images/poster_timer.jpg"
//           />
//           <div className="caption">TODO · 개인 타이머 · 챗봇</div>
//         </div>
//       </div>

//       {/* Section 3 */}
//       <div className="section" data-anchor="outro">
//         <div className="outro">
//           <h2>바로 시작해보세요</h2>
//           <a className="cta" href="/signup">
//             무료로 체험하기
//           </a>
//         </div>
//       </div>

//       <style jsx global>{`
//         html,
//         body {
//           padding: 0;
//           margin: 0;
//           background: #000;
//           color: #fff;
//           font-family:
//             system-ui,
//             -apple-system,
//             Segoe UI,
//             Roboto,
//             Noto Sans KR,
//             Arial,
//             sans-serif;
//         }
//         .section {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//         }
//         .hero h1 {
//           font-size: clamp(2.5rem, 5vw, 5rem);
//           margin: 0 0 0.5rem;
//           letter-spacing: 0.02em;
//         }
//         .hero p {
//           opacity: 0.85;
//           margin: 0 0 1rem;
//           font-size: clamp(1rem, 2.2vw, 1.5rem);
//         }
//         .hint {
//           display: inline-block;
//           opacity: 0.6;
//           font-size: 0.9rem;
//         }
//         .video-wrap {
//           width: min(1200px, 92vw);
//           position: relative;
//         }
//         .video-wrap video {
//           width: 100%;
//           height: auto;
//           border-radius: 16px;
//           outline: 1px solid rgba(255, 255, 255, 0.06);
//           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
//           background: #111;
//         }
//         .caption {
//           margin-top: 16px;
//           font-size: clamp(1rem, 2vw, 1.25rem);
//           opacity: 0.85;
//         }
//         .outro h2 {
//           font-size: clamp(2rem, 4vw, 3rem);
//           margin-bottom: 1.25rem;
//         }
//         .cta {
//           display: inline-block;
//           padding: 0.9rem 1.25rem;
//           border-radius: 999px;
//           background: #00ffd1;
//           color: #000;
//           text-decoration: none;
//           font-weight: 700;
//           transition:
//             transform 0.15s ease,
//             box-shadow 0.15s ease;
//         }
//         .cta:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 10px 30px rgba(0, 255, 209, 0.25);
//         }
//       `}</style>
//     </div>
//   );
// }

export default function GuidePage() {
  return <div>Guide</div>;
}
