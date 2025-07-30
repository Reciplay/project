'use client';

import Image from 'next/image';
import styles from './schedule.module.scss';
import React from 'react';
import { Calendar, theme } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

export default function Schedule() {
    const { token } = theme.useToken();

    const wrapperStyle: React.CSSProperties = {
        width: 400,
        // border: `1px solid ${token.colorBorderSecondary}`,
        // borderRadius: token.borderRadiusLG,
    };
    return (
        <div className={styles.container}>
            <div className={styles.divTag}>
                <div style={wrapperStyle}>
                    <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                </div>
            </div>
            <div className={styles.schedule}>
                <span>스케줄</span>
                <ul>
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                </ul>
            </div>
        </div>
    )
}