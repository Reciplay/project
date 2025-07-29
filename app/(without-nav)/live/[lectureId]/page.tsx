"use client";

import styles from "./page.module.scss";

const recipe = {
  recipe: "백종원 소갈비찜",
  chapters: [
    {
      title: "Chapter 1. 갈비 핏물 제거",
      todo: [
        "소갈비를 찬물에 담근다",
        "중간에 물을 여러 번 갈아주며 약 1시간 30분간 핏물 제거",
      ],
    },
    {
      title: "Chapter 2. 양념장 만들기",
      todo: [
        "설탕 ½컵, 맛술 ½컵, 물 1컵, 진간장 1컵, 다진 마늘 2큰술, 생강 ½큰술, 참기름 2큰술, 대파 1대를 한 그릇에 넣기",
        "설탕이 녹을 때까지 잘 저어주기",
      ],
    },
    {
      title: "Chapter 3. 갈비와 양념 끓이기",
      todo: [
        "핏물 뺀 갈비에 양념을 붓기",
        "생수 1병을 추가로 넣기",
        "센불에서 팔팔 끓이기 시작",
        "재우는 과정 없이 바로 조리 시작",
      ],
    },
    {
      title: "Chapter 4. 야채 준비 및 추가",
      todo: [
        "당근 ½개, 감자 2개 썰기",
        "끓는 중에 위로 뜬 거품을 걷어내기",
        "야채 넣기",
        "중불~약불에서 국물이 졸아들 때까지 오래 끓이기",
      ],
    },
    {
      title: "Chapter 5. 마무리 & 팁",
      todo: [
        "국물이 자작해질 때까지 졸이기",
        "고기가 부드러워질 때까지 충분히 익히기",
        "기호에 따라 청양고추 송송 썰어 넣기 (아이들과 먹을 땐 생략)",
        "뼈에서 살이 쏙 발라질 정도로 익히기",
      ],
    },
  ],
};

export default function Page() {
  return (
    <div className={styles.container}>
      {/* 상단 정보 바 */}
      <div className={styles.header}>
        <span className={styles.badge}>🍖 {recipe.recipe}</span>
        <span className={styles.timer}>
          🕐 총 {recipe.chapters.length}단계 조리
        </span>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.main}>
        {/* 왼쪽: 라이브 영상 영역 (예시) */}
        <div className={styles.videoSection}>
          <div className={styles.instructorArea}>
            {/* Instructor video feed goes here */}
          </div>
        </div>

        {/* 오른쪽: 체크리스트 영역 */}
        <div className={styles.checklistSection}>
          <div className={styles.checklistBox}>
            {recipe.chapters.map((chapter, index) => (
              <div className={styles.chapter} key={index}>
                <div className={styles.dot} />
                <div className={styles.chapterContent}>
                  <h4>{chapter.title}</h4>
                  <ul>
                    {chapter.todo.map((item, i) => (
                      <li key={i}>✅ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
