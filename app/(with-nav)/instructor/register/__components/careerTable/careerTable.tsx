import { useInstructorStore } from "@/stores/instructorStore";
import type { TableColumnsType } from "antd";
import { Table } from "antd";

type RowType = {
  key: React.Key;
  companyName: string;
  position: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  jobDescription: string;
};

function CareersTable() {
  const { careers, removeCareer } = useInstructorStore();

  const dataSource: RowType[] = careers.map((c, idx) => ({
    key: c.id ?? `${c.companyName}-${c.position}-${c.startDate}-${idx}`,
    companyName: c.companyName,
    position: c.position,
    startDate: (c.startDate ?? "").slice(0, 7), // YYYY-MM만 표시
    endDate: (c.endDate ?? "").slice(0, 7),
    jobDescription: c.jobDescription,
  }));

  const columns: TableColumnsType<RowType> = [
    { title: "회사명", dataIndex: "companyName", key: "companyName" },
    { title: "직책", dataIndex: "position", key: "position" },
    { title: "시작월", dataIndex: "startDate", key: "startDate" },
    { title: "종료월", dataIndex: "endDate", key: "endDate" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_text, _record, index) => (
        <a onClick={() => removeCareer(index)}>Delete</a>
      ),
    },
  ];

  return (
    <Table<RowType>
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>
            {`회사명: ${record.companyName} | 직책: ${record.position} | 기간: ${record.startDate} ~ ${record.endDate} | 업무: ${record.jobDescription}`}
          </p>
        ),
        rowExpandable: () => true,
      }}
    />
  );
}

export default CareersTable;
