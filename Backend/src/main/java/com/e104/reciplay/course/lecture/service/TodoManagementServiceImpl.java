package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureRegisterRequest;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.TodoInfo;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;
import com.e104.reciplay.entity.Todo;
import com.e104.reciplay.repository.TodoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoManagementServiceImpl implements TodoManagementService {
    private final TodoRepository todoRepository;

    @Override
    public void registerTodoItems(List<LectureRequest> requests, Queue<Long> chapterIds) {
        List<Todo> todos = new ArrayList<>();

        for(int i = 0; i < requests.size(); i++) {
            LectureControlRequest request = requests.get(i).getRequest();
            for(ChapterItem chapterItem : request.getChapterList()) {
                Long chapterId = chapterIds.poll();
                for(TodoInfo todo : chapterItem.getTodoList()) {
                    todos.add(new Todo(todo, chapterId));
                }
            }
        }

        todoRepository.saveAll(todos);
    }

    @Override
    public void deleteAllTodos(Long chapterId) {
        todoRepository.deleteByChapterId(chapterId);
    }

    @Override
    @Transactional
    public void updateTodos(Map<Long, ChapterItem> chapterItemMap) {
        Set<Long> idSet = chapterItemMap.keySet();

        for(Long chapterId : idSet) {
            ChapterItem chapterItem = chapterItemMap.get(chapterId);

            List<Todo> nulls = new ArrayList<>();
            Map<Long, TodoInfo> todoMap = new HashMap<>();

            List<TodoInfo> todoInfos = chapterItem.getTodoList();
            for(TodoInfo info : todoInfos) {
                if(info.getId() == null) nulls.add(new Todo(info, chapterId));
                else todoMap.put(info.getId(), info);
            }

            List<Todo> todos = todoRepository.findByChapterId(chapterId);
            for(Todo todo : todos) {
                todo.update(todoMap.get(todo.getId()));
            }
        }
    }
}
