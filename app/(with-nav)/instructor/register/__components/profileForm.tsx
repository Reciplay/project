'use client';

import styles from '../page.module.scss';
import classNames from 'classnames';
import IconWithText from '@/components/text/iconWithText';
import BaseButton from '@/components/button/baseButton';
import Image from 'next/image';

interface ProfileData {
    name: string;
    genderBirth: string;
    email: string;
    job: string;
    phone: string;
    address: string;
}

interface ProfileFormProps {
    isEditMode: boolean;
    onEditToggle: (on: boolean) => void;
    value: ProfileData;
    onChange: (field: keyof ProfileData, value: string) => void;
    onCancel: () => void;
    onSave: () => void;
}

export default function ProfileForm({
    isEditMode,
    onEditToggle,
    value,
    onChange,
    onCancel,
    onSave
}: ProfileFormProps) {
    return (
        <div className={styles.frame}>
            <div className={styles.textContainer}>
                <div className={styles.nameWrapper}>
                    {isEditMode ? (
                        <input
                            className={classNames(styles.name, styles.input)}
                            value={value.name}
                            onChange={(e) => onChange('name', e.target.value)}
                        />
                    ) : (
                        <span className={styles.name}>{value.name}</span>
                    )}

                    {!isEditMode && (
                        <IconWithText
                            iconName="update"
                            title=""
                            onClick={() => onEditToggle(true)}
                        />
                    )}
                </div>

                {isEditMode ? (
                    <input
                        className={classNames(styles.name, styles.input)}
                        value={value.genderBirth}
                        onChange={(e) => onChange('genderBirth', e.target.value)}
                    />
                ) : (
                    <span className={styles.text}>{value.genderBirth}</span>
                )}

                <div className={styles.innerText}>
                    <IconWithText
                        iconName="email"
                        title={value.email}
                        editable={isEditMode}
                        onChange={(val) => onChange('email', val)}
                    />
                    <IconWithText
                        iconName="user2"
                        title={value.job}
                        editable={isEditMode}
                        onChange={(val) => onChange('job', val)}
                    />
                    <IconWithText
                        iconName="phoneNumber"
                        title={value.phone}
                        editable={isEditMode}
                        onChange={(val) => onChange('phone', val)}
                    />
                </div>

                <IconWithText
                    iconName="address"
                    title={value.address}
                    editable={isEditMode}
                    onChange={(val) => onChange('address', val)}
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
                            onClick={onCancel}
                        />
                        <BaseButton
                            title="저장"
                            variant="custom"
                            type="submit"
                            size="sm"
                            className={styles.wishButton}
                            onClick={onSave}
                        />
                    </div>
                )}
            </div>

            <div className={styles.imageWrapper}>
                <Image src="/images/profile2.jpg" fill alt="profile" style={{ objectFit: 'cover' }} />
            </div>
        </div>
    );
}
