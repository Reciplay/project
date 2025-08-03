'use client';

import styles from '../page.module.scss';
import classNames from 'classnames';
import IconWithText from '@/components/text/iconWithText';
import BaseButton from '@/components/button/baseButton';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

interface ProfileFormProps {
  value: {
    address: string;
    phoneNumber: string;
    name: string;
    genderBirth: string;
    email: string;
    job: string;
  };
  onChange: (data: FormData) => void;
}

interface FormData {
  address: string;
  phoneNumber: string;
}

export default function ProfileForm({ value, onChange }: ProfileFormProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      address: value.address,
      phoneNumber: value.phoneNumber,
    },
  });

  // 외부 상태가 바뀌면 폼 초기화
  useEffect(() => {
    reset({
      address: value.address,
      phoneNumber: value.phoneNumber,
    });
  }, [value, reset]);

  const handleCancel = () => {
    reset(); // 기본값으로 초기화
    setIsEditMode(false);
  };

  const handleSave = (data: FormData) => {
  // 👉 백엔드에 저장 요청 보내기 (API 호출 위치)
  // await axios.post('/api/profile/update', data);

  onChange(data); // ✅ 부모 컴포넌트에 변경 알림
  setIsEditMode(false);
  console.log(data);
};


  return (
    <form onSubmit={handleSubmit(handleSave)} className={styles.frame}>
      <div className={styles.textContainer}>
        <div className={styles.nameWrapper}>
          <span className={styles.name}>{value.name}</span>
          {!isEditMode && (
            <IconWithText iconName="update" title="" onClick={() => setIsEditMode(true)} />
          )}
        </div>

        <span className={styles.text}>{value.genderBirth}</span>

        <div className={styles.innerText}>
          <IconWithText iconName="email" title={value.email} />
          <IconWithText iconName="user2" title={value.job} />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <IconWithText
                iconName="phoneNumber"
                title={value.phoneNumber}
                editable={isEditMode}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <IconWithText
              iconName="address"
              title={value.address}
              editable={isEditMode}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {isEditMode && (
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
              type="submit"
              size="sm"
              className={styles.wishButton}
            />
          </div>
        )}
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/profile2.jpg"
          fill
          alt="profile"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </form>
  );
}
