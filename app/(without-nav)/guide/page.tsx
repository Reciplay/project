'use client';

import { useEffect, useRef } from 'react';
import Fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';

export default function FullpageDemo() {
    const fpInstance = useRef<any | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // 각 섹션 비디오 ref를 배열로 관리(섹션 id 순서대로)
    const videoRefs = useRef<HTMLVideoElement[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        // fullPage 초기화
        fpInstance.current = new Fullpage(containerRef.current, {
            licenseKey: 'YOUR_KEY_IF_NEEDED', // 상용이면 라이선스 키
            navigation: true,
            scrollingSpeed: 700,
            responsiveWidth: 768,
            anchors: ['intro', 'demo1', 'demo2', 'outro'],

            // 섹션 진입 후
            afterLoad: (_origin: any, destination: any) => {
                const index = destination.index as number;
                const v = videoRefs.current[index];
                if (v) {
                    // 모바일 자동재생 정책 대비: muted + playsInline 필수
                    v.muted = true;
                    v.playsInline = true;
                    v.play().catch(() => {
                        // 자동재생 실패시 대비 로직(필요하면 UI로 안내)
                        // console.warn('Autoplay blocked');
                    });
                }
            },

            // 섹션 떠날 때
            onLeave: (_origin: any, destination: any, direction: any) => {
                const index = _origin.index as number;
                const v = videoRefs.current[index];
                if (v) {
                    v.pause();
                    // 필요하면 다음에 다시 들어올 때 처음부터 재생
                    // v.currentTime = 0;
                }
            },
        });

        // 첫 섹션 비디오도 보장 재생(초기 진입 직후)
        setTimeout(() => {
            const v = videoRefs.current[0];
            if (v) {
                v.muted = true;
                v.playsInline = true;
                v.play().catch(() => { });
            }
        }, 0);

        return () => {
            // 정리
            if (fpInstance.current) {
                fpInstance.current.destroy('all');
                fpInstance.current = null;
            }
        };
    }, []);

    // ref를 배열에 주입하기 위한 헬퍼
    const setVideoRef = (idx: number) => (el: HTMLVideoElement | null) => {
        if (el) videoRefs.current[idx] = el;
    };

    return (
        <div id="fullpage" ref={containerRef}>
            {/* Section 0: 인트로(정적) */}
            <div className="section" data-anchor="intro">
                <div className="hero">
                    <h1>Reciplay</h1>
                    <p>제스처로 즐기는 실시간 요리 클래스</p>
                    <span className="hint">스크롤하여 데모 보기 ↓</span>
                </div>
            </div>

            {/* Section 1: 비디오 1 */}
            <div className="section" data-anchor="demo1">
                <div className="video-wrap">
                    <video
                        ref={setVideoRef(1)}
                        preload="none"
                        playsInline
                        muted
                        controls={false}
                        // 데모용 소스(원하는 소스로 교체)
                        src="/videos/instructor_ok_gesture.mp4"
                        poster="/images/poster_ok.jpg"
                    />
                    <div className="caption">OK 제스처로 단계 완료</div>
                </div>
            </div>

            {/* Section 2: 비디오 2 */}
            <div className="section" data-anchor="demo2">
                <div className="video-wrap">
                    <video
                        ref={setVideoRef(2)}
                        preload="none"
                        playsInline
                        muted
                        controls={false}
                        src="/videos/timer_and_todo.mp4"
                        poster="/images/poster_timer.jpg"
                    />
                    <div className="caption">TODO · 개인 타이머 · 챗봇</div>
                </div>
            </div>

            {/* Section 3: 아웃트로(정적) */}
            <div className="section" data-anchor="outro">
                <div className="outro">
                    <h2>바로 시작해보세요</h2>
                    <a className="cta" href="/signup">무료로 체험하기</a>
                </div>
            </div>

            <style jsx global>{`
        /* 기본 리셋 */
        html, body {
          padding: 0; margin: 0;
          background: #000;
          color: #fff;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR, Arial, sans-serif;
        }

        /* 섹션 공통 */
        .section {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        /* 인트로 */
        .hero h1 {
          font-size: clamp(2.5rem, 5vw, 5rem);
          margin: 0 0 0.5rem;
          letter-spacing: 0.02em;
        }
        .hero p {
          opacity: 0.85;
          margin: 0 0 1rem;
          font-size: clamp(1rem, 2.2vw, 1.5rem);
        }
        .hint {
          display: inline-block;
          opacity: 0.6;
          font-size: 0.9rem;
        }

        /* 비디오 섹션 */
        .video-wrap {
          width: min(1200px, 92vw);
          position: relative;
        }
        .video-wrap video {
          width: 100%;
          height: auto;
          border-radius: 16px;
          outline: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 10px 40px rgba(0,0,0,0.45);
          background: #111;
        }
        .caption {
          margin-top: 16px;
          font-size: clamp(1rem, 2vw, 1.25rem);
          opacity: 0.85;
        }

        /* 아웃트로 */
        .outro h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1.25rem;
        }
        .cta {
          display: inline-block;
          padding: 0.9rem 1.25rem;
          border-radius: 999px;
          background: #00ffd1;
          color: #000;
          text-decoration: none;
          font-weight: 700;
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0,255,209,.25);
        }
      `}</style>
        </div>
    );
}