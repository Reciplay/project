import styles from './lectureForm.module.scss'
import { Flex, Input, Radio, Select, InputNumber } from 'antd';
import { useState } from 'react';
import type { RadioChangeEvent, SelectProps } from 'antd';
import MonthDatePicker from '@/components/calendar/monthDatePicker';

export default function LectureForm() {
    const { TextArea } = Input;
    return (
        <>
            <div className={styles.container}>
                <Flex vertical gap={12}>
                    <Input placeholder="강좌명을 입력해주세요" variant="underlined" />
                </Flex>
                <MonthDatePicker></MonthDatePicker>
                <TextArea rows={4} placeholder="강의를 소개해 주세요 필수내용 - 강의별 내용(커리큘럼) 준비물" maxLength={6} />
                <TextArea rows={4} placeholder="TodoList를 생성해주세요" maxLength={6} />

            </div>
        </>
    )
}