"use client";

import BaseInput from "@/components/input/baseInput";
import BaseButton from '@/components/button/baseButton';
import styles from "./certificate.module.scss";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { DatePicker } from "antd";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { sampleLicenses } from "@/config/sampleLicenses";
import { ResponseLicense } from "@/types/license";
import { useInstructorStore } from "@/stores/instructorStore";
import { Dayjs } from "dayjs";
import List from "./license/licenseList";

export default function Certificate() {
  const [showInput, setShowInput] = useState(false);
  const [certificateName, setCertificateName] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [issuer, setIssuer] = useState('');
  const [licenseOptions, setLicenseOptions] = useState<ResponseLicense[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [useApi, setUseApi] = useState(true);

  const { addCertificate, certificates } = useInstructorStore();

  useEffect(() => {
    if (!useApi) return;

    const timeout = setTimeout(async () => {
      if (certificateName.trim().length < 1) {
        setLicenseOptions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await restClient.get<ApiResponse<ResponseLicense[]>>(
          "/user/license/list"
        );
        setLicenseOptions(res.data.data);
      } catch (error) {
        console.warn("API 호출 실패. 더미 데이터 사용", error);
        setLicenseOptions(sampleLicenses.data);
      } finally {
        setShowDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [certificateName, useApi]);

  const handleCancel = () => {
    setShowInput(false);
    setCertificateName('');
    setIssuer('');
    setSelectedId(null);
    setSelectedDate(null);
    setShowDropdown(false);
  };

  const handleSave = () => {
    if (!certificateName || !issuer || !selectedDate || !selectedId) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const formattedDate = selectedDate.format("YYYY-MM") + "-01";

    addCertificate({
      id: selectedId,
      licenseName: certificateName,
      institution: issuer,
      acquisitionDate: formattedDate,
      grade: 0,
    });

    // 🔥 입력값만 초기화하고 인풋창은 유지
    setCertificateName('');
    setIssuer('');
    setSelectedId(null);
    setSelectedDate(null);
    setShowDropdown(false);
  };


  const escapeRegex = (value: string) =>
    value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  return (
    <div>
      <div className={styles.topContainer}>
        <span className={styles.title}>자격증</span>
        <div className={styles.addContainer} onClick={() => setShowInput(true)}>
          <Image src="/icons/plus.svg" alt="plus" width={13} height={13} />
          <span className={styles.addText}>추가</span>
        </div>

      </div>
      <hr />
      {certificates.length === 0 && !showInput && (
        <div className={styles.holderContainer}>
          <span className={styles.placeHolder}>자격증을 입력해주세요</span>
        </div>
      )}

      {showInput && (
        <>
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <BaseInput
                placeholder="자격증명"
                type="custom"
                value={certificateName}
                onChange={(e) => {
                  const value = e.target.value;
                  setCertificateName(value);
                  setSelectedId(null);
                  setUseApi(false);

                  if (!value.trim()) {
                    setLicenseOptions([]);
                    setShowDropdown(false);
                    return;
                  }

                  try {
                    const regex = new RegExp(escapeRegex(value), 'i');
                    const filtered = sampleLicenses.data.filter((item) =>
                      regex.test(item.name)
                    );
                    setLicenseOptions(filtered);
                  } catch (err) {
                    console.error("정규식 에러:", err);
                    setLicenseOptions([]);
                  } finally {
                    setShowDropdown(true);
                  }
                }}
              />

              {showDropdown && (
                <ul className={styles.dropdown}>
                  {licenseOptions.length > 0 ? (
                    licenseOptions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => {
                          setCertificateName(item.name);
                          setSelectedId(item.id);
                          setShowDropdown(false);
                          setUseApi(true);
                        }}
                      >
                        <div className={styles.name}>{item.name}</div>
                      </li>
                    ))
                  ) : (
                    <li className={styles.noResult}>검색 결과가 없습니다</li>
                  )}
                </ul>
              )}
            </div>

            <BaseInput
              placeholder="발행처/기관"
              type="custom"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
            />

            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              picker="month"
              placeholder="취득 월 선택"
              className={styles.customDatePicker}
            />
          </div>
          <div>
            <List></List>
          </div>

          <div className={styles.buttonWrapper}>
            <BaseButton
              title="취소"
              variant="custom"
              type="button"
              size="sm"
              color="white"
              className={styles.wishButton}
              onClick={handleCancel}
            />
            <BaseButton
              title="저장"
              variant="custom"
              type="button"
              size="sm"
              className={styles.wishButton}
              onClick={handleSave}
            />
          </div>
        </>
      )}
    </div>
  );
}
