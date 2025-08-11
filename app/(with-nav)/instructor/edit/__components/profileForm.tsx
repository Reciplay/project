'use client';

import styles from '../page.module.scss';
import IconWithText from '@/components/text/iconWithText';
import Image from 'next/image';
import { useInstructorStore } from '@/stores/instructorStore';
import { Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';
import AddressPicker from '../../register/__components/address/addressPicker';

interface ProfileFormProps {
  value: {
    name: string;
    genderBirth: string;
    email: string;
    job: string;
  };
  initialCoverImageUrl?: string; // ✅ 추가: 수정 모드 초기 커버 이미지 URL
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function ProfileForm({ value, initialCoverImageUrl }: ProfileFormProps) {
  const [addrOpen, setAddrOpen] = useState(false);
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  const [phoneError, setPhoneError] = useState('');
  const { profile, setProfile, setCoverImageFile } = useInstructorStore();
  const [fileList, setFileList] = useState<UploadFile[]>([]); // ✅ 초기 비움

  // ✅ 수정 모드: 서버 URL로 썸네일 프리셋
  useEffect(() => {
    if (initialCoverImageUrl) {
      setFileList([{
        uid: '-1',
        name: 'coverImage',
        status: 'done',
        url: initialCoverImageUrl,
      }]);
      setCoverImageFile(null); // 새 파일 없음
    }
  }, [initialCoverImageUrl, setCoverImageFile]);

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
    <form className={styles.frame} onSubmit={(e) => e.preventDefault()}>
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
              if (!/^[\d-]*$/.test(v)) return; // 숫자/하이픈만
              setProfile({ ...profile, phoneNumber: v });
              setPhoneError(v === '' || phoneRegex.test(v) ? '' : '형식: 010-1234-5678');
            }}
          />
        </div>

        <IconWithText
          iconName="address"
          title={profile.address}
          editable={true}
          value={profile.address}
          onClick={() => setAddrOpen(true)}
        />

        <AddressPicker
          open={addrOpen}
          onClose={() => setAddrOpen(false)}
          onSelect={(addr) => setProfile({ ...profile, address: addr })}
        />

        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            beforeUpload={(file) => {
              setCoverImageFile(file);
              setFileList([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: URL.createObjectURL(file),
                originFileObj: file,
              }]);
              return false; // 수동 업로드
            }}
            onRemove={() => {
              setCoverImageFile(null);
              setFileList([]);
            }}
            onPreview={onPreview}
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
        </ImgCrop>
      </div>

      <div className={styles.imageWrapper}>
        <Image src="/images/profile2.png" fill alt="profile" style={{ objectFit: 'cover' }} />
      </div>
    </form>
  );
}
