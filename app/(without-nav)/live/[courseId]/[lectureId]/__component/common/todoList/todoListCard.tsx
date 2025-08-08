import styles from './todoListCard.module.scss';
import { useTodoStore } from '@/stores/todoStore';
import { Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useLiveStore } from '@/stores/liveStore';
export default function TodoListCard() {
    const todos = useTodoStore((state) => state.todos);
    const chapter = useLiveStore((s) => s.chapter);
    if (!chapter) return null;

    return (
        <section>
            <h2>현재 챕터: #{chapter.chapterSequence} — {chapter.chapterName}</h2>
            <p>할 일 {chapter.numOfTodos}개</p>
            <ol>
                {chapter.todos.map(todo => (
                    <li key={todo.sequence}>
                        <strong>{todo.title}</strong> [{todo.type}]
                        {todo.type === 'TIMER' && todo.seconds ? ` • ${todo.seconds}s` : null}
                    </li>
                ))}
            </ol>
        </section>
    );
}
