package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.entity.Todo;
import com.e104.reciplay.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoQueryServiceImpl implements TodoQueryService{
    private final TodoRepository todoRepository;
    @Override
    public List<Todo> queryTodosByChapterId(Long chapterId) {
        return todoRepository.findByChapterId(chapterId);
    }
}
