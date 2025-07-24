// ThumbnailUpload.tsx
"use client";

import { useState } from 'react';
import styles from './thumbnail.module.scss';
import { UploadOutlined } from '@ant-design/icons'; // Ant Design 아이콘 임포트
import { Button, message, Upload } from 'antd'; // Ant Design 컴포넌트 임포트
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'; // 타입 임포트

export default function ThumbnailUpload() {
    // File[] 대신 UploadFile[] 타입을 사용하는 것이 Ant Design Upload 컴포넌트와 더 잘 호환됩니다.
    const [images, setImages] = useState<UploadFile[]>([]);

    // Ant Design Upload 컴포넌트의 props 설정
    const uploadProps: UploadProps = {
        name: 'thumbnail_files', // 서버로 전송될 파일의 필드 이름
        multiple: true, // 여러 파일 업로드 허용
        listType: 'picture', // 'text', 'picture', 'picture-card' 중 선택 (미리보기 스타일)
        fileList: images, // 현재 업로드된 파일 목록 (상태와 동기화)
        action: 'https://your-upload-api-endpoint.com/upload', // 실제 파일 업로드 API 엔드포인트로 변경하세요.

        // 파일을 수동으로 처리할 경우 customRequest 사용
        // customRequest: async ({ file, onSuccess, onError }) => {
        //     // 여기에 실제 파일 업로드 로직 (예: fetch 또는 Axios를 사용한 서버 전송)을 구현합니다.
        //     console.log('Custom upload logic for:', file);
        //     try {
        //         // 예시: 파일 업로드 성공 가정
        //         // const formData = new FormData();
        //         // formData.append('file', file);
        //         // const response = await fetch('/api/upload', {
        //         //     method: 'POST',
        //         //     body: formData,
        //         // });
        //         // const data = await response.json();
        //         onSuccess(null, file); // 성공 시 호출
        //         message.success(`${file.name} 파일 업로드 성공!`);
        //     } catch (error) {
        //         onError(new Error('파일 업로드 실패!')); // 실패 시 호출
        //         message.error(`${file.name} 파일 업로드 실패.`);
        //     }
        // },

        // 파일 상태 변경 시 호출되는 콜백 함수
        onChange(info) {
            let newFileList = [...info.fileList];

            // 1. 제한된 수의 파일만 표시 (선택 사항)
            // newFileList = newFileList.slice(-2); // 최신 2개 파일만 유지

            // 2. 파일 목록 업데이트
            setImages(newFileList);

            // 3. 파일 업로드 상태에 따른 메시지
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 파일 업로드 성공`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 파일 업로드 실패.`);
            }
        },
        // 파일을 업로드하기 전에 호출되는 함수 (유효성 검사 등)
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('JPG/PNG 파일만 업로드 가능합니다!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('이미지 크기는 2MB 이하여야 합니다!');
            }
            return isJpgOrPng && isLt2M;
        },
    };

    return (
        <div className={styles.wrapper}>
            <div>미리보기</div>
            <hr />
            <div className={styles.previewContainer}>
                {[0, 1, 2].map((index) => {
                    const file = images[index];

                    // file.url 대신 file.thumbUrl 또는 URL.createObjectURL(file.originFileObj) 사용
                    // file.originFileObj가 있을 때만 URL.createObjectURL을 사용하여 즉시 미리보기
                    const imageUrl = file?.thumbUrl || (file?.originFileObj ? URL.createObjectURL(file.originFileObj) : null);

                    if (imageUrl) {
                        return (
                            <div key={index} className={styles.thumbnailCard}>
                                <img src={imageUrl} alt={`썸네일 ${index + 1}`} className={styles.thumbnail} />
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className={styles.thumbnailCard + ' ' + styles.placeholder}>
                                <span>이미지를 업로드하세요</span>
                            </div>
                        );
                    }
                })}
            </div>

            <div className={styles.uploadSection}>
                <Upload {...uploadProps}
                    showUploadList={false} // Ant Design의 기본 업로드 목록을 숨김
                >
                    {/* 기존의 커스텀 업로드 버튼 UI를 children으로 전달 */}
                    <Button icon={<UploadOutlined />} className={styles.uploadButton}>
                        <span>강좌 썸네일 등록하기</span>
                    </Button>
                </Upload>
            </div>
        </div>
    );
}