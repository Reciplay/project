"use client";

import BaseButton from '@/components/button/baseButton';
import styles from './introduction.module.scss'
import IconWithText from "@/components/text/iconWithText";
import { useState } from 'react';


export default function Introduction() {
	const originalText = `세계 무대를 누빈 한식 셰프, 에드워드 권입니다.
서울 리츠칼튼부터 미국 샌프란시스코, 두바이, 중국, 그리고 W호텔까지,
글로벌 호텔에서 총괄 셰프로 활동한 경력을 바탕으로, 여러분께 실전 중심의 요리 노하우를 전해드립니다.
한식의 품격을 세계에 알린 셰프의 수업을 직접 경험해보세요.`;

	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState(originalText);
	const [tempText, setTempText] = useState(originalText);

	const handleSave = () => {
		setText(tempText);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setTempText(text);       // 원래 내용 복원
		setIsEditing(false);     // 편집 모드 종료
	};

	return (
		<div>
			<span className={styles.title}>소개말</span>
			<hr />
			<div className={styles.container}>
				{isEditing ? (
					<textarea
						className={styles.textarea}
						value={tempText}
						onChange={(e) => setTempText(e.target.value)}
					/>
				) : (
					<span className={styles.content}>
						{text.split('\n').map((line, idx) => (
							<span key={idx}>{line} <br /></span>
						))}
					</span>
				)}
				<div className={styles.iconWrapper}>
					{!isEditing && (
						<>
							<IconWithText
								iconName="update"
								title=""
								onClick={() => setIsEditing(true)}
							/>
							<IconWithText
								iconName="delete"
								title=""
								onClick={() => console.log("삭제 기능 필요 시 구현")}
							/>
						</>
					)}
				</div>
			</div>

			{isEditing && (
				<div className={styles.buttonWrapper}>
					<BaseButton
						title="취소"
						variant="custom"
						type="submit"
						size="sm"
						color='white'
						className={styles.wishButton}
						onClick={handleCancel}
					/>
					<BaseButton
						title="저장"
						variant="custom"
						type="submit"
						size="sm"
						className={styles.wishButton}
						onClick={handleSave}
					/>
				</div>
			)}
		</div>
	)
}