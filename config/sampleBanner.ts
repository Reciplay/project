export interface Banner {
  id: number;
  background: string;
  item: string;
  title: string;
  desc: string;
  slogan?: string;
  isItemRight: boolean;
}

export const sampleBanner: Banner[] = [
  {
    id: 1,
    background: "/images/mainbanner2.png",
    item: "/images/mainItem2.png",
    isItemRight: false,
    title: "맛의 본질을 배우는 시간,\n셰프 클래스 오픈",
    desc: "실전 중심 미슐랭 셰프 클래스 지금 바로 시작하세요.",
  },
  {
    id: 0,
    background: "/images/mainbanner1.png",
    item: "/images/mainItem1.png",
    isItemRight: true,
    title: "레스토랑말고, 당신의 부엌에서",
    desc: "실전 중심 미슐랭 셰프 클래스 오픈",
    slogan: "Bring fine dining into your kitchen",
  },
];
