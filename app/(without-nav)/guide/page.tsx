"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import ScrollStack, { ScrollStackItem } from "./__components/scrollStack";
import ScrollVelocity from "./__components/scrollVelocity";
import styles from "./page.module.scss";

// 유틸
const cx = (...a: Array<string | false | undefined>) =>
  a.filter(Boolean).join(" ");

// 공통 섹션
function Section({
  id,
  title,
  eyebrow,
  children,
  className,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cx(styles.section, className)}>
      <div className={styles.sectionHead}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.card, className)}>{children}</div>;
}

function Bento({
  title,
  desc,
  icon,
  children,
}: {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} className={styles.bento}>
      <div className={styles.bentoHead}>
        <div className={styles.bentoIcon}>{icon}</div>
        <h3 className={styles.bentoTitle}>{title}</h3>
      </div>
      {desc && <p className={styles.bentoDesc}>{desc}</p>}
      {children && <div className={styles.bentoBody}>{children}</div>}
    </motion.div>
  );
}

function MiniLineChart({ points }: { points: number[] }) {
  const d = useMemo(() => {
    if (!points.length) return "";
    const max = Math.max(...points);
    const min = Math.min(...points);
    const norm = points.map((p) =>
      max === min ? 0.5 : (p - min) / (max - min),
    );
    const step = 160 / Math.max(points.length - 1, 1);
    return norm
      .map((n, i) => `${i === 0 ? "M" : "L"} ${i * step}, ${80 - n * 70 - 5}`)
      .join(" ");
  }, [points]);

  return (
    <svg viewBox="0 0 160 80" className={styles.miniChart}>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#g)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Toast({ open, message }: { open: boolean; message: string }) {
  return (
    <div
      className={cx(styles.toast, open ? styles.toastOpen : styles.toastClosed)}
    >
      {message}
    </div>
  );
}

// 수정된 부분: 인터랙션 강화를 위해 스크롤 패럴랙스 히어로 구현
function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <div ref={ref} className={styles.hero3d}>
      <motion.div
        className={styles.heroBg}
        style={{
          backgroundImage: "url(/images/food1.jpg)", // 수정된 부분: 실제 경로
          y,
          scale,
          opacity,
        }}
      />
      <div className={styles.heroShade} />
      <div className={styles.heroOverlay}>
        <ScrollVelocity texts={["Reciplay 🍽️ Let's Play"]} velocity={80} />
      </div>
    </div>
  );
}

export default function Page() {
  // 탭 인터랙션
  const [activeFeature, setActiveFeature] = useState<
    "todo" | "timer" | "gesture" | "chatbot" | "instructor"
  >("gesture");
  const [teacherAlert, setTeacherAlert] = useState<string>("");

  const features = [
    { key: "todo", label: "TODO 리스트" },
    { key: "timer", label: "개인 타이머" },
    { key: "gesture", label: "손 제스처" },
    { key: "chatbot", label: "챗봇 피드백" },
    { key: "instructor", label: "강사 차트/어텐션" },
  ] as const;

  const chartData = [12, 16, 14, 18, 22, 21, 26, 24];

  const triggerAlert = (msg: string) => {
    setTeacherAlert(msg);
    const id = setTimeout(() => setTeacherAlert(""), 1800);
    return () => clearTimeout(id);
  };

  return (
    <main className={styles.container}>
      {/* 수정된 부분: 스티키 헤더 + 그라데이션 바 */}
      {/* <header className={styles.headerWrap}>
        <div className={styles.headerBar} />
        <div className={styles.headerRow}>
          <nav className={styles.nav}>
            <a href="#overview">개요</a>
            <a href="#problems">문제 정의</a>
            <a href="#features">기능</a>
            <a href="#flow">사용 흐름</a>
            <a href="#stack">기술 스택</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className={styles.ctaWrap}>
            <a href="#features" className={styles.headerCta}>
              시작하기
            </a>
          </div>
        </div>
      </header> */}

      {/* 수정된 부분: 패럴랙스 히어로 */}
      <Hero />

      <Toast open={!!teacherAlert} message={teacherAlert} />

      {/* 개요 */}
      <Section id="overview" title="제스쳐를 이용한 실시간 요리 클래스">
        <ScrollStack>
          <ScrollStackItem
            bgImageSrc="/images/food3.jpg" // 수정된 부분
            bgImageAlt="Demo dish"
            bgDimOpacity={0.45}
          >
            <p>제스처 인식 수업</p>
          </ScrollStackItem>
          <ScrollStackItem
            bgImageSrc="/images/cook2.jpg" // 수정된 부분
            bgImageAlt="Demo dish"
            bgDimOpacity={0.45}
          >
            <p>실시간 화면 전환</p>
          </ScrollStackItem>
          <ScrollStackItem
            bgImageSrc="/images/food2.jpg" // 수정된 부분
            bgImageAlt="Demo dish"
            bgDimOpacity={0.45}
          >
            <p>개인 타이머 & 진행률</p>
          </ScrollStackItem>
          <ScrollStackItem
            bgImageSrc="/images/food3.jpg" // 수정된 부분
            bgImageAlt="Demo dish"
            bgDimOpacity={0.45}
          >
            <p>AI 코치 챗봇</p>
          </ScrollStackItem>
          <ScrollStackItem
            bgImageSrc="/images/sample1.jpg" // 수정된 부분
            bgImageAlt="Demo dish"
            bgDimOpacity={0.45}
          >
            <p>비접촉·위생 안전</p>
          </ScrollStackItem>
          <ScrollStackItem
            bgImageSrc="/images/sample10.jpg" // 수정된 부분
            bgImageAlt="Demo dish"
            bgDimOpacity={0.45}
          >
            <p>실시간 TODO 리스트</p>
          </ScrollStackItem>
        </ScrollStack>
      </Section>

      {/* 문제 정의 */}
      <Section id="problems" title="실시간 실습 수업의 어려움">
        <p>
          실시간 실습 수업에서는 한 번 내용을 놓치면 되돌리기가 어려워 복습
          <br />
          타이밍이 제한적이며, 손을 자유롭게 쓸 수 없어 키보드나 마우스 조작이
          <br />
          불편합니다. 또한 강사와 수강생 간의 상호작용이 부족해 소통이 단절되기
          <br />
          쉽고, 집중을 유지하기 어려워 몰입도가 저하됩니다. 게다가 강사가 개별
          <br />
          수강생의 진도를 실시간으로 파악하기도 쉽지 않아 수업 운영에 어려움이
          <br />
          따릅니다.
        </p>
      </Section>

      {/* 기능 데모 */}
      <Section id="features" eyebrow="주요 기능" title="핵심 기능 체험">
        {/* 수정된 부분: 탭을 스크롤 스냅/리치호버로 강화 */}
        <div
          className={styles.featureTabs}
          role="tablist"
          aria-label="features"
        >
          {features.map((f) => (
            <button
              role="tab"
              aria-selected={activeFeature === f.key}
              key={f.key}
              onClick={() => setActiveFeature(f.key)}
              className={cx(
                styles.tabBtn,
                activeFeature === f.key && styles.tabBtnActive,
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.grid2}>
          <Card>
            {activeFeature === "todo" && (
              <div>
                <h4 className={styles.h4}>단계별 할 일 시각화</h4>
                <p className={styles.mutedText}>
                  제스처로 완료 체크하며 강의 흐름을 순차적으로 표시합니다.
                </p>
                <ol className={styles.ol}>
                  <li>1) 재료 손질하기 – 완료 제스처</li>
                  <li>2) 5분간 끓이기 – 자동 타이머</li>
                  <li>3) 간 보기 – 챗봇 팁</li>
                </ol>
              </div>
            )}
            {activeFeature === "timer" && (
              <div>
                <h4 className={styles.h4}>개인 타이머</h4>
                <p className={styles.mutedText}>
                  각 수강생 상황에 맞춘 타이머로 자동 시작/종료가 가능합니다.
                </p>
                <div className={styles.rowGap}>
                  <button
                    className={styles.ghostBtn}
                    onClick={() => triggerAlert("⏱️ 개인 타이머 시작")}
                  >
                    Start
                  </button>
                  <button
                    className={styles.ghostBtn}
                    onClick={() => triggerAlert("⏹ 타이머 종료")}
                  >
                    Stop
                  </button>
                </div>
              </div>
            )}
            {activeFeature === "gesture" && (
              <div>
                <h4 className={styles.h4}>손 제스처 인식</h4>
                <p className={styles.mutedText}>
                  완료/질문 등의 제스처를 인식해 비접촉 인터랙션을 제공합니다.
                </p>
                <div className={styles.grid2sm}>
                  <button
                    className={styles.ghostBtn}
                    onClick={() => triggerAlert("✅ 완료: 다음 단계로 이동")}
                  >
                    완료
                  </button>
                  <button
                    className={styles.ghostBtn}
                    onClick={() => triggerAlert("❓ 질문: 강사 알림")}
                  >
                    질문
                  </button>
                </div>
              </div>
            )}
            {activeFeature === "chatbot" && (
              <div>
                <h4 className={styles.h4}>챗봇 피드백</h4>
                <p className={styles.mutedText}>
                  강의자료 기반 RAG 챗봇이 놓친 내용을 설명하고 Q&A를
                  제공합니다.
                </p>
                <div className={styles.chatBubble}>
                  “질문이 접수되었어요. 지금 단계의 핵심은 <b>약불 유지</b>{" "}
                  입니다.”
                </div>
              </div>
            )}
            {activeFeature === "instructor" && (
              <div>
                <h4 className={styles.h4}>강사 차트/어텐션</h4>
                <p className={styles.mutedText}>
                  수강생 상태를 차트로 시각화하고 주의 분산 시 어텐션 알림을
                  전송합니다.
                </p>
                <MiniLineChart points={chartData} />
              </div>
            )}
          </Card>

          <Card>
            <div className={styles.grid2sm}>
              <Bento title="영상 + TODO" icon={<span>🎬</span>}>
                <div className={styles.mutedTextXs}>
                  영상 옆에 단계 표시 · 제스처 제어
                </div>
              </Bento>
              <Bento title="타이머" icon={<span>⏱️</span>}>
                <div className={styles.mutedTextXs}>
                  개인 타이머 자동 시작/종료
                </div>
              </Bento>
              <Bento title="제스처" icon={<span>✋</span>}>
                <div className={styles.mutedTextXs}>
                  완료/질문 등 비접촉 인터랙션
                </div>
              </Bento>
              <Bento title="챗봇" icon={<span>🤖</span>}>
                <div className={styles.mutedTextXs}>놓친 내용 요약/가이드</div>
              </Bento>
            </div>
          </Card>
        </div>
      </Section>

      {/* 사용 흐름 */}
      <Section
        id="flow"
        eyebrow="사용 흐름 예시"
        title="수업 시작부터 종료까지"
      >
        <ol className={styles.flowGrid}>
          {[
            "수업 시작 – TODO 확인",
            "완료 제스처 수행",
            "타이머 자동 시작",
            "질문 제스처 – 강사 알림",
            "종료 – 챗봇 요약 제공",
          ].map((step, i) => (
            <li key={i} className={styles.flowItem}>
              <div className={styles.flowBadge}>{i + 1}</div>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      {/* 스택 */}
      <Section
        id="stack"
        eyebrow="기술 스택 & 아키텍처"
        title="Backend · Frontend"
      >
        <div className={styles.grid2}>
          <Card>
            <h4 className={styles.h4}>Backend</h4>
            <p className={styles.mutedText}>
              Spring Boot · STOMP · Redis · MySQL · JWT · Docker · Jenkins 등
            </p>
          </Card>
          <Card>
            <h4 className={styles.h4}>Frontend</h4>
            <p className={styles.mutedText}>
              Next.js(Typescript) · SCSS · Zustand · Jest
            </p>
          </Card>
        </div>
      </Section>

      {/* 수정된 부분: DeeVid와 유사한 FAQ 섹션 추가 */}
      <Section id="faq" eyebrow="자주 묻는 질문" title="FAQ">
        <div className={styles.faqGrid}>
          {[
            {
              q: "어떤 제스처를 지원하나요?",
              a: "완료/질문/주의 환기 등 기본 제스처를 지원하며, 커스텀 제스처를 확장할 수 있습니다.",
            },
            {
              q: "오프라인 환경에서도 동작하나요?",
              a: "핵심 모듈은 로컬에서 동작하고, 요약/기록 등은 연결 시 동기화됩니다.",
            },
            {
              q: "개인정보는 안전하게 처리되나요?",
              a: "수집 최소화/암호화/비식별화를 원칙으로 처리합니다.",
            },
            {
              q: "수강생 단말 스펙 요구사항은?",
              a: "웹캠과 마이크 권한이 필요하며, 최신 브라우저를 권장합니다.",
            },
          ].map((f, i) => (
            <details key={i} className={styles.faqItem}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* 강한 CTA 푸터 */}
      <footer className={styles.footer}>
        <div className={styles.footerCta}>
          <h3>지금 바로 실습형 수업을 업그레이드하세요</h3>
          <a href="#features" className={styles.ctaPrimary}>
            무료로 시작
          </a>
        </div>
        <div className={styles.copy}>
          © {new Date().getFullYear()} Reciplay
        </div>
      </footer>
    </main>
  );
}
