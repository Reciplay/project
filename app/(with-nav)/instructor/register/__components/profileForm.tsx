"use client";

import IconWithText from "@/components/text/iconWithText";
import { useInstructorStore } from "@/stores/instructorStore";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import styles from "../page.module.scss";
import AddressPicker from "./address/addressPicker";

interface ProfileFormProps {
  value: {
    name: string;
    genderBirth: string;
    email: string;
    job: string;
  };
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function ProfileForm({ value }: ProfileFormProps) {
  const [addrOpen, setAddrOpen] = useState(false);
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  const [, setPhoneError] = useState("");
  const { profile, setProfile, setCoverImageFile } = useInstructorStore();
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "upload",
      status: "done",
      url: "",
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
    const image = document.createElement("img");
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <form className={styles.frame} onSubmit={(e) => e.preventDefault()}>
      <div>
        <div className={styles.title}>커버 이미지 등록</div>
        <ImgCrop rotationSlider aspect={16 / 9}>
          <Upload
            className={styles.upload}
            // listType="picture-card": 업로드 UI를 썸네일 카드형으로 만듦
            listType="picture-card"
            // maxCount={1}: 최대 1개의 파일만 업로드 가능 (중복 업로드 방지)
            maxCount={1}
            // 현재 선택된 파일 리스트 (useState로 관리됨)
            fileList={fileList}
            // 파일이 업로드될 때마다 실행되는 콜백 함수
            beforeUpload={(file) => {
              setCoverImageFile(file);
              setFileList([
                {
                  uid: file.uid,
                  name: file.name,
                  status: "done",
                  url: URL.createObjectURL(file),
                  originFileObj: file,
                },
              ]);
              return false;
            }}
            onRemove={() => {
              setCoverImageFile(null);
              setFileList([]);
            }}
            onPreview={onPreview}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
      </div>

      <div className={styles.textContainer}>
        <div className={styles.nameWrapper}>
          <span className={styles.name}>{value.name}</span>
        </div>

        <span className={styles.text}>{value.genderBirth}</span>

        <div className={styles.innerText}>
          <IconWithText iconName="email" title={value.email} />
          <IconWithText iconName="user2" title={value.job} />

          <IconWithText
            iconName="phonenumber"
            title={profile.phoneNumber}
            editable={true}
            value={profile.phoneNumber}
            placeholder="xxx-xxxx-xxxx"
            onChange={(v: string) => {
              // 숫자/하이픈 외 입력 차단
              if (!/^[\d-]*$/.test(v)) return;

              setProfile({ ...profile, phoneNumber: v });

              // 포맷 검사 후 에러 메시지 설정
              if (v === "" || phoneRegex.test(v)) {
                setPhoneError("");
              } else {
                setPhoneError("형식: 010-1234-5678");
              }
            }}
          />
          <>
            <IconWithText
              iconName="address"
              title={profile.address}
              editable={true}
              value={profile.address}
              onClick={() => setAddrOpen(true)} // <-- 버튼 클릭 시 팝업 열림
              placeholder="주소를 입력해 주세요."
            />

            <AddressPicker
              open={addrOpen}
              onClose={() => setAddrOpen(false)}
              onSelect={(addr) => {
                setProfile({ ...profile, address: addr });
              }}
            />
          </>
        </div>
      </div>
    </form>
  );
}
