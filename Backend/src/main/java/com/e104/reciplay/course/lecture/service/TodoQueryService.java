package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.entity.Todo;

import java.util.List;

public interface TodoQueryService {
    List<Todo> queryTodosByChapterId(Long chapterId);
}
