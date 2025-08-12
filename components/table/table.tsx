import type { TableColumnsType, TableProps } from "antd";
import { Divider, Radio, Table } from "antd";
import React, { useState } from "react";

export default function TableComponent() {
  interface DataType {
    key: React.Key;
    일자: string;
    시작시간: string;
    종료시간: string;
    강의명: string;
    강의소개: string;
    강의요약: string;
    교육자료: string;
  }

  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox",
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "일자",
      dataIndex: "일자",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "시작시간",
      dataIndex: "시작시간",
    },
    {
      title: "종료시간",
      dataIndex: "종료시간",
    },
    {
      title: "강의명",
      dataIndex: "강의명",
    },
    {
      title: "강의소개",
      dataIndex: "강의소개",
    },
    {
      title: "강의요약",
      dataIndex: "강의요약",
    },
    {
      title: "교육자료",
      dataIndex: "교육자료",
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      일자: "2025.02",
      시작시간: "16:00",
      종료시간: "20:00",
      강의명: "맛있는 한식 수업",
      강의소개: "맛있는 수업을 ,,,,",
      강의요약: "맛있는 수업을 ,,,,",
      교육자료: "한식 정보 책/pdf",
    },
    {
      key: "2",
      일자: "2025.02",
      시작시간: "16:00",
      종료시간: "20:00",
      강의명: "맛있는 한식 수업",
      강의소개: "맛있는 수업을 ,,,,",
      강의요약: "맛있는 수업을 ,,,,",
      교육자료: "한식 정보 책/pdf",
    },
    {
      key: "3",
      일자: "2025.02",
      시작시간: "16:00",
      종료시간: "20:00",
      강의명: "맛있는 한식 수업",
      강의소개: "맛있는 수업을 ,,,,",
      강의요약: "맛있는 수업을 ,,,,",
      교육자료: "한식 정보 책/pdf",
    },

    {
      key: "4",
      일자: "2025.02",
      시작시간: "16:00",
      종료시간: "20:00",
      강의명: "맛있는 한식 수업",
      강의소개: "맛있는 수업을 ,,,,",
      강의요약: "맛있는 수업을 ,,,,",
      교육자료: "한식 정보 책/pdf",
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows,
      );
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.일자 === "Disabled User", // Column configuration not to be checked
      name: record.일자,
    }),
  };

  return (
    <>
      <div>
        <Radio.Group
          onChange={(e) => setSelectionType(e.target.value)}
          value={selectionType}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">radio</Radio>
        </Radio.Group>
        <Divider />
        <Table<DataType>
          rowSelection={{ type: selectionType, ...rowSelection }}
          columns={columns}
          dataSource={data}
        />
      </div>
    </>
  );
}
