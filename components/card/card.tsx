// import { CARDTYPE } from "@/types/card";
// import { Course } from "@/types/course";
// import { IMAGETYPE } from "@/types/image";
// import classNames from "classnames";
// import ImageWrapper from "../image/imageWrapper";
// import MetaInfo from "./__components/metaInfo";
// import styles from "./card.module.scss";

// interface CardProps {
//   data: Course;
//   type: CARDTYPE;
// }

// export default function Card({ data, type }: CardProps) {
//   // const filledStars = Math.floor(data.ratingAvg);
//   // const emptyStars = 5 - filledStars;

//   const isHorizontal = type === CARDTYPE.HORIZONTAL;

//   return (
//     <div className={classNames(styles.card, styles[type])}>
//       <ImageWrapper
//         src={data.thumbnail}
//         alt={data.title}
//         type={
//           isHorizontal ? IMAGETYPE.HORIZONTAL_CARD : IMAGETYPE.VERTICAL_CARD
//         }
//       />
//       <div className={styles.content}>
//         <h3 className={styles.title}>{data.title}</h3>
//         <MetaInfo
//           props={{
//             instructorName: data.instructorName,
//             isLive: data.isLive,
//             viewerCount: data.viewerCount,
//           }}
//         />
//       </div>
//     </div>
//   );
// }
