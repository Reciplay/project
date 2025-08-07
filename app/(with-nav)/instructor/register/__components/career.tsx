"use client";

import BaseInput from "@/components/input/baseInput";
import BaseButton from '@/components/button/baseButton';
import styles from "./career.module.scss";
import Image from "next/image";
import { useState } from 'react';
import MonthDatePicker from "@/components/calendar/monthDatePicker";
import { DatePicker } from "antd";

export default function Career() {
    const [showInput, setShowInput] = useState(false);
    const [certificateName, setCertificateName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [certificates, setCertificates] = useState<{ name: string; issuer: string }[]>([]);

    const handleCancel = () => {
        setShowInput(false);
        setCertificateName('');
        setIssuer('');
    };

    const handleSave = () => {
        if (certificateName && issuer) {
            setCertificates([...certificates, { name: certificateName, issuer: issuer }]);
            handleCancel(); // Clear inputs and hide them after saving
        } else {
            alert('자격증명과 발행처/기관을 모두 입력해주세요.'); // Basic validation
        }
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

            {certificates.map((cert, index) => (
                <div key={index} className={styles.certificateItem}>
                    <span className={styles.certificateName}>{cert.name}</span>
                    <span className={styles.certificateIssuer}>{cert.issuer}</span>
                </div>
            ))}

            {/* Input fields and buttons */}
            {showInput && (
                <>
                    <div>
                        <div className={styles.inputContainer}>
                            <BaseInput
                                placeholder="회사명 *"
                                type="custom"
                                value={certificateName}
                                onChange={(e) => setCertificateName(e.target.value)}
                            />
                            <BaseInput
                                placeholder="직책"
                                type="custom"
                                value={issuer}
                                onChange={(e) => setIssuer(e.target.value)}
                            />
                            <DatePicker
                                onChange={() => { }}
                                picker="month"
                                placeholder="입사년월"
                                className={styles.customDatePicker}
                            />
                            <DatePicker
                                onChange={() => { }}
                                picker="month"
                                placeholder="퇴사년월"
                                className={styles.customDatePicker}
                            />
                        </div>
                        <textarea className={styles.textarea} placeholder="담당했던 업무에 대해 작성해주세요"></textarea>
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
        </div >
    );
}