'use client';
import { Radio } from 'antd';
import { useCreateCourseStore } from '@/hooks/course/useCreateCourseStore'; // 너가 적은 스토어 경로
import styles from './categoryForm.module.scss';

const CATEGORIES = [
  { id: 1, name: '한식' },
  { id: 2, name: '중식' },
  { id: 3, name: '일식' },
  { id: 4, name: '양식' },
  { id: 5, name: '제과/제빵' },
  { id: 6, name: '기타' },
];

type Props = {
  name: 'requestCourseInfo.categoryId';
  label?: string;
};

export default function CategoryForm({ label }: Props) {
  const categoryId = useCreateCourseStore(s => s.values.requestCourseInfo.categoryId);
  const error = useCreateCourseStore(s => s.errors['requestCourseInfo.categoryId']);
  const setField = useCreateCourseStore(s => s.setField);

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div className={styles.title}>{label}</div>}
      <Radio.Group
        value={categoryId ?? undefined}
        onChange={(e) => setField('requestCourseInfo.categoryId', Number(e.target.value))}
        style={{ marginTop: 8 }}
      >
        {CATEGORIES.map(c => (
          <Radio.Button key={c.id} value={c.id}>{c.name}</Radio.Button>
        ))}
      </Radio.Group>
      {error && <p style={{ color: 'red', marginTop: 4 }}>{error}</p>}
    </div>
  );
}
