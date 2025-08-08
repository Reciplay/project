package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.response.TodoInfo;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import com.e104.reciplay.entity.Todo;
import com.e104.reciplay.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoManagementServiceImpl implements TodoManagementService {
    private final TodoRepository todoRepository;

    @Override
    public void registerTodoItems(List<LectureRegisterRequest> requests, Queue<Long> chapterIds) {
        List<Todo> todos = new ArrayList<>();

        for(int i = 0; i < requests.size(); i++) {
            LectureRequest request = requests.get(i).getLectureRequest();
            for(ChapterItem chapterItem : request.getChapterList()) {
                Long chapterId = chapterIds.poll();
                for(TodoInfo todo : chapterItem.getTodoList()) {
                    todos.add(new Todo(todo, chapterId));
                }
            }
        }

        todoRepository.saveAll(todos);
    }
}
