import { useInstructorStore } from "@/stores/instructorStore";
import type { TableColumnsType } from "antd";
import { Table } from "antd";

// Certificate 타입이 이미 스토어에 있음
type RowType = {
  key: React.Key;
  licenseName: string;
  institution: string;
  acquisitionDate: string; // YYYY-MM-DD
  grade: number;
};

function CertificatesTable() {
  const { certificates, removeCertificate } = useInstructorStore();

  const dataSource: RowType[] = certificates.map((c, idx) => ({
    key:
      c.id ?? `${c.licenseName}-${c.institution}-${c.acquisitionDate}-${idx}`,
    licenseName: c.licenseName,
    institution: c.institution,
    acquisitionDate: (c.acquisitionDate ?? "").slice(0, 7), // YYYY-MM만 표시
    grade: c.grade,
  }));

  const columns: TableColumnsType<RowType> = [
    { title: "자격증명", dataIndex: "licenseName", key: "licenseName" },
    { title: "발행처/기관", dataIndex: "institution", key: "institution" },
    { title: "취득월", dataIndex: "acquisitionDate", key: "acquisitionDate" },
    { title: "등급", dataIndex: "grade", key: "grade", width: 80 },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_text, _record, index) => (
        <a onClick={() => removeCertificate(index)}>Delete</a>
      ),
    },
  ];

  return (
    <Table<RowType>
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      // 필요 시 확장영역
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>
            {`자격증: ${record.licenseName} | 기관: ${record.institution} | 취득월: ${record.acquisitionDate} | 등급: ${record.grade}`}
          </p>
        ),
        rowExpandable: () => true,
      }}
    />
  );
}

export default CertificatesTable;
