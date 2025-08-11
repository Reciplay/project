"use client";

import BaseButton from "@/components/button/baseButton";
import TableComponent from "@/components/table/table";
import type { RadioChangeEvent, SelectProps } from "antd";
import { Flex, Input, InputNumber, Radio } from "antd";
import { useState } from "react";
import LectureForm from "../lectureform/lectureForm";
import ThumbnailUpload from "../thumbnail/thumbnail";
import styles from "./create.module.scss";

export default function Create() {
  type SelectCommonPlacement = SelectProps["placement"];
  const [placement, SetPlacement] = useState<SelectCommonPlacement>("topLeft");

  const placementChange = (e: RadioChangeEvent) => {
    SetPlacement(e.target.value);
  };

  const { TextArea } = Input;

  return (
    <div>
      <ThumbnailUpload />
      <section className={styles.detail}>
        <span>세부설정</span>
        <hr />
        <Flex vertical gap={12}>
          <Input placeholder="강좌명을 입력해주세요" variant="underlined" />
        </Flex>
        <span>어떤 분야의 강좌를 진행할 예정인가요?</span>
        <Radio.Group value={placement} onChange={placementChange}>
          <Radio.Button value="Korean">한식</Radio.Button>
          <Radio.Button value="Japanese">일식</Radio.Button>
          <Radio.Button value="Chinese">중식</Radio.Button>
          <Radio.Button value="Western">양식</Radio.Button>
          <Radio.Button value="Bakery ">제과</Radio.Button>
          <Radio.Button value="Others">기타</Radio.Button>
        </Radio.Group>

        <TextArea rows={4} placeholder="강좌를 소개해 주세요" maxLength={6} />
        <Flex vertical gap={12}>
          <InputNumber
            placeholder="모집 최대 인원을 설정해주세요"
            variant="underlined"
            style={{ width: 300 }}
          />
        </Flex>
        <Flex vertical gap={12}>
          <InputNumber
            placeholder="강좌의 난이도를 설정해주세요 (1~100)"
            variant="underlined"
            style={{ width: 300 }}
          />
        </Flex>
      </section>
      <section className={styles.schedule}>
        <span>강의별 스케줄을 등록해주세요 (커리큘럼)</span>
        <LectureForm></LectureForm>
      </section>
      <TableComponent></TableComponent>
      <BaseButton
        title="강좌 등록 요청하기"
        size="lg"
        variant="custom"
      ></BaseButton>
    </div>
  );
}