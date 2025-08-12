import type { DatePickerProps, GetProps } from "antd";
import { DatePicker, Space } from "antd";
import React from "react";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

const onOk = (value: DatePickerProps["value"] | RangePickerProps["value"]) => {
  console.log("onOk: ", value);
};

const LectureRegisterDatePicker: React.FC = () => (
  <Space direction="vertical" size={12}>
    {/* <DatePicker
      showTime
      onChange={(value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }}
      onOk={onOk}
    /> */}
    <RangePicker
      showTime={{ format: "HH:mm" }}
      format="YYYY-MM-DD HH:mm"
      onChange={(value, dateString) => {
        console.log("Selected Time: ", value);
        console.log("Formatted Selected Time: ", dateString);
      }}
      onOk={onOk}
    />
  </Space>
);

export default LectureRegisterDatePicker;
