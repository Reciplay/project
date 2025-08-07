import styles from './todoListCard.module.scss';
import { useTodoStore } from '@/stores/todoStore';
import { Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

export default function TodoListCard() {
    const todos = useTodoStore((state) => state.todos);

    return (
        <div>
            <h3>이번 챕터 할 일</h3>
            <ul>
                {todos.map((todo, idx) => (
                    <li key={idx}>
                        {todo.sequence}. {todo.title} ({todo.type} - {todo.seconds}s)
                    </li>
                ))}
            </ul>
        </div>
    );
}
