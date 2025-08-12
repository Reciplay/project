import { UserSummary } from "@/types/user";
import commonStyles from "../../../page.module.scss";
interface MemberTableProps {
  list: UserSummary[];
  onRowClick: (MemberId: number) => void;
}

export default function MemberTable({ list, onRowClick }: MemberTableProps) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <table className={commonStyles.table}>
      <thead>
        <tr>
          <th>이름</th>
          <th>이메일</th>
          <th>생성일</th>
        </tr>
      </thead>
      <tbody>
        {list.map((inst) => (
          <tr key={inst.userId} onClick={() => onRowClick(inst.userId)}>
            <td>{formatDate(inst.name)}</td>
            <td>{inst.email}</td>
            <td>{inst.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
