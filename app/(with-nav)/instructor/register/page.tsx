"use client"

import styles from "./page.module.scss";
import Introduction from "./__components/introduction";
import Certificate from "./__components/certificate";
import Career from "./__components/career";
import classNames from "classnames";
import { useEffect, useState } from 'react';
import BaseButton from "@/components/button/baseButton";
import ProfileForm from "./__components/profileForm"; // 맨 위에 import 추가
import { useInstructorStore } from "@/stores/instructorStore";
import { useRouter } from 'next/navigation';
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";


export default function page() {

	const [basicProfile, setProfile] = useState<{
		name: string;
		genderBirth: string;
		email: string;
		job: string;
	}>({
		name: '이지언',
		genderBirth: '여 2000 (25세)',
		email: 'ssafyfavorait@example.com',
		job: '양식 강사',
	});
	const { profile, introduction, certificates, careers } = useInstructorStore();
	const router = useRouter();

	const postInstructorData = async (data: any) => {
		const res = await fetch('/api/v1/instructor', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error('강사 등록 실패');
		}
		return res.json();
	};

	const handleSave = async () => {
		const payload = {
			...profile,
			introduction,
			certificates,
			careers,
		};

		console.log('💾 전송할 payload:', payload);

		try {
			await postInstructorData(payload);
			alert('등록 완료!');
			router.push('/instructor/edit');
		} catch (e) {
			console.error(e);
			alert('등록 실패');
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	// 기본 정보 가져오는 함수 백엔드 api 요청
	const fetchProfile = async () => {
		try {
			const { data } = await restClient.get<ApiResponse<User>>("/user/profile", {
				requireAuth: true,
			});

			const { name, job, birthDate, gender, email } = data.data;
			console.log(data.data)

			const genderText = gender === 0 ? "여" : "남";
			const age = calculateAge(birthDate);

			setProfile({
				name: name,
				genderBirth: `${genderText} ${formatBirth(birthDate)} (${age}세)`,
				email: email,
				job: job,
			});
		} catch (e) {
			console.error("프로필 불러오기 실패", e);

			setProfile({
				name: '이지언',
				genderBirth: '여 2000 (25세)',
				email: 'ssafyfavorait@example.com',
				job: '양식 강사',
			});
		}
	};

	// 만나이 계산 함수
	const calculateAge = (birthDateStr: string): number => {
		const birth = new Date(birthDateStr);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const m = today.getMonth() - birth.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	/**
	 * 생년월일 문자열에서 연도를 추출해 네 자리 숫자로 반환
	 * 예: "2000-08-04" → "2000"
	 *
	 * @param birthDateStr YYYY-MM-DD 형식의 생년월일 문자열
	 * @returns 연도 (예: "2000")
	 */
	const formatBirth = (birthDateStr: string): string => {
		const birth = new Date(birthDateStr);
		return birth.getFullYear().toString(); // 예: "2000"
	};

	return (
		<div className={styles.container}>
			<div className={styles.infoContainer}>
				<ProfileForm
					value={basicProfile}
				/>

				<Introduction></Introduction>
				<Certificate></Certificate>
				<Career />
				<div className={styles.buttonWrapper}>
					<BaseButton
						title="취소"
						variant="custom"
						type="button"
						size="sm"
						color="white"
						className={styles.wishButton}
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
			</div>
		</div>
	)
}
