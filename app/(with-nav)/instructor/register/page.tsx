"use client"

import Image from "next/image";
import styles from "./page.module.scss";
import IconWithText from "@/components/text/iconWithText";
import Introduction from "./__components/introduction";
import Certificate from "./__components/certificate";
import Career from "./__components/career";
import classNames from "classnames";
import { useState } from 'react';
import BaseButton from "@/components/button/baseButton";
import ProfileForm from "./__components/profileForm"; // 맨 위에 import 추가


export default function page() {
	const [isEditMode, setIsEditMode] = useState(false);

	const [profile, setProfile] = useState({
		name: '이지언',
		genderBirth: '여 2000 (25세)',
		email: 'ssafyjoa@example.com',
		job: '양식 강사',
		phoneNumber: '010-5555-6666',
		address: '부산 강서구 명지국제6로 107 부산명지 대방디엠시티 센텀오션 2차',
	});
	const [originalProfile, setOriginalProfile] = useState(profile);

	const handleChange = (field: string, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className={styles.container}>
			<ProfileForm
  value={profile}
  onChange={(updated) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  }}
/>
			<div className={styles.infoContainer}>

				<Introduction></Introduction>
				<Certificate></Certificate>
				<Career />
			</div>
		</div>
	)
}