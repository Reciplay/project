'use client';

import styles from '../page.module.scss';
import classNames from 'classnames';
import IconWithText from '@/components/text/iconWithText';
import Image from 'next/image';
import { useInstructorStore } from '@/stores/instructorStore';
import { Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';

interface ProfileFormProps {
  value: {
    name: string;
    genderBirth: string;
    email: string;
    job: string;
  };
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function ProfileForm({ value }: ProfileFormProps) {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  const [phoneError, setPhoneError] = useState('');
  const { profile, setProfile } = useInstructorStore();
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'upload',
      status: 'done',
      url: '',
    },
  ]);

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = document.createElement('img');
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };



  return (
    <form className={styles.frame}>
      <div className={styles.textContainer}>
        <div className={styles.nameWrapper}>
          <span className={styles.name}>{value.name}</span>

        </div>

        <span className={styles.text}>{value.genderBirth}</span>

        <div className={styles.innerText}>
          <IconWithText iconName="email" title={value.email} />
          <IconWithText iconName="user2" title={value.job} />

          <IconWithText
            iconName="phoneNumber"
            title={profile.phoneNumber}
            editable={true}
            value={profile.phoneNumber}
            onChange={(v: string) => {
              // 숫자/하이픈 외 입력 차단
              if (!/^[\d-]*$/.test(v)) return;

              setProfile({ ...profile, phoneNumber: v });

              // 포맷 검사 후 에러 메시지 설정
              if (v === '' || phoneRegex.test(v)) {
                setPhoneError('');
              } else {
                setPhoneError('형식: 010-1234-5678');
              }
            }}
          />
        </div>

        <IconWithText
          iconName="address"
          title={profile.address}
          editable={true}
          value={profile.address}
          onChange={(v: string) => setProfile({ ...profile, address: v })}
        />

        <ImgCrop rotationSlider>
          <Upload
            // 나중에 백엔드가 제공하는 진짜 API 주소로 바꿔야함 이미지 저장하는 저장소 api
            action="..."
            // listType="picture-card": 업로드 UI를 썸네일 카드형으로 만듦
            listType="picture-card"
            // maxCount={1}: 최대 1개의 파일만 업로드 가능 (중복 업로드 방지)
            maxCount={1}
            // 현재 선택된 파일 리스트 (useState로 관리됨)
            fileList={fileList}
            // 파일이 업로드될 때마다 실행되는 콜백 함수
            // newList는 현재까지의 전체 파일 목록을 의미
            onChange={({ fileList: newList }) => {
              // 가장 마지막에 업로드된 파일 하나만 추출
              // 만약 여러 개 드래그로 올렸을 경우, 가장 최신 1개만 유지
              const latest = newList.slice(-1);
              // 현재 파일 리스트 상태를 마지막 하나로 덮어쓰기
              setFileList(latest);
              // 업로드가 완료되면 서버 응답에 포함된 이미지 URL 추출
              const url = latest[0]?.response?.url;
              // 추출한 url이 존재하면 기존 profile 객체를 펼친 뒤(...profile), 
              // coverImage 필드를 새 URL로 덮어서 상태 저장
              if (url) setProfile({ ...profile, coverImage: url });
            }}
            onPreview={onPreview}
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
        </ImgCrop>
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/profile2.png"
          fill
          alt="profile"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </form>
  );
}
