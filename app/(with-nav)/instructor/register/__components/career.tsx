"use client";

import BaseInput from "@/components/input/baseInput";
import BaseButton from '@/components/button/baseButton';
import styles from "./career.module.scss";
import Image from "next/image";
import { useState } from 'react';
import { DatePicker } from "antd";
import { useInstructorStore } from "@/stores/instructorStore";
import CareersTable from "./careerTable/careerTable";

export default function Career() {
    const [showInput, setShowInput] = useState(false);
    const [certificates, setCertificates] = useState<{ name: string; issuer: string }[]>([]);
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const { careers, addCareer, removeCareer } = useInstructorStore();

    const handleCancel = () => {
        setShowInput(false);
        setCompanyName('');
        setPosition('');
        setJobDescription('');
        setStartDate('');
        setEndDate('');
    };

    const handleSave = () => {
        if (!companyName || !position || !startDate || !endDate) {
            alert('회사명, 직책, 시작일, 종료일을 모두 입력해주세요.');
            return;
        }

        addCareer({
            companyName,
            position,
            jobDescription,
            startDate,
            endDate,
        });
    };

    return (
        <div>
            <div className={styles.topContainer}>
                <span className={styles.title}>경력</span>
                <div className={styles.addContainer} onClick={() => setShowInput(true)} style={{ cursor: 'pointer' }}>
                    <Image src="/icons/plus.svg" alt="plus" width={13} height={13} />
                    <span className={styles.addText}>추가</span>
                </div>
            </div>
            <hr />

            {/* Display existing certificates */}
            {certificates.length === 0 && !showInput && (
                <div className={styles.holderContainer}>
                    <span className={styles.placeHolder}>경력을 입력해주세요</span>
                </div>
            )}

            {/* Input fields and buttons */}
            {showInput && (
                <>
                    <div>
                        <div className={styles.inputContainer}>
                            <BaseInput
                                placeholder="회사명 *"
                                type="custom"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <BaseInput
                                placeholder="직책"
                                type="custom"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                            <DatePicker
                                onChange={(date) => setStartDate(date?.format("YYYY-MM-DD") || '')}
                                picker="month"
                                placeholder="입사년월"
                                className={styles.customDatePicker}
                            />
                            <DatePicker
                                onChange={(date) => setEndDate(date?.format("YYYY-MM-DD") || '')}
                                picker="month"
                                placeholder="퇴사년월"
                                className={styles.customDatePicker}
                            />
                        </div>
                        <textarea
                            className={styles.textarea}
                            placeholder="담당했던 업무에 대해 작성해주세요"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>


                    <div className={styles.buttonWrapper}>
                        <BaseButton
                            title="취소"
                            variant="custom"
                            type="button" // Changed to "button" to prevent form submission
                            size="sm"
                            color='white'
                            className={styles.wishButton}
                            onClick={handleCancel}
                        />
                        <BaseButton
                            title="저장"
                            variant="custom"
                            type="button" // Changed to "button" to prevent form submission
                            size="sm"
                            className={styles.wishButton}
                            onClick={handleSave}
                        />
                    </div>
                </>
            )
            }
            <div style={{ marginTop: 12 }}>
                <CareersTable />
            </div>
        </div >
    );
}