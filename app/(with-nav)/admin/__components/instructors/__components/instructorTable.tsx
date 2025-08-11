import { InstructorSummary } from "@/types/instructor";
import commonStyles from "../../../page.module.scss";
interface InstructorTableProps {
  list: InstructorSummary[];
  onRowClick: (instructorId: number) => void;
}

export default function InstructorTable({
  list,
  onRowClick,
}: InstructorTableProps) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <table className={commonStyles.table}>
      <thead>
        <tr>
          <th>등록일</th>
          <th>이름</th>
        </tr>
      </thead>
      <tbody>
        {list.map((inst) => (
          <tr
            key={inst.instructorId}
            onClick={() => onRowClick(inst.instructorId)}
          >
            <td>{formatDate(inst.registeredAt)}</td>
            <td>{inst.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
