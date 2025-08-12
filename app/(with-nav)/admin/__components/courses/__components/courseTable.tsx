import commonStyles from "../../../page.module.scss";
import { CourseSummary } from "@/types/course";
interface CourseTableProps {
  list: CourseSummary[];
  onRowClick: (CourseId: number) => void;
}

export default function CourseTable({ list, onRowClick }: CourseTableProps) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <table className={commonStyles.table}>
      <thead>
        <tr>
          <th>등록일</th>
          <th>강좌명</th>
          <th>강사</th>
        </tr>
      </thead>
      <tbody>
        {list.map((inst) => (
          <tr key={inst.courseId} onClick={() => onRowClick(inst.courseId)}>
            <td>{formatDate(inst.registeredAt)}</td>
            <td>{inst.title}</td>
            <td>{inst.instructorName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
