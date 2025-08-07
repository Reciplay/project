package com.e104_2.reciplaywebsocket.room.service;

import com.e104_2.reciplaywebsocket.entity.Chapter;
import com.e104_2.reciplaywebsocket.entity.Todo;
import com.e104_2.reciplaywebsocket.room.dto.response.ChapterTodoResponse;
import com.e104_2.reciplaywebsocket.room.dto.response.item.TodoSummary;
import com.e104_2.reciplaywebsocket.room.repository.TodoRepository;
import com.e104_2.reciplaywebsocket.room.service.addtional.ChapterQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoQueryServiceImpl implements TodoQueryService{
    private final ChapterQueryService chapterQueryService;
    private final TodoRepository todoRepository;

    @Override
    public ChapterTodoResponse queryTodoOfChapter(Long lectureId, Integer chapterSequence) {
        Chapter chapter = chapterQueryService.queryChapterByLectureIdAndSequence(lectureId, chapterSequence);
        List<Todo> todos = todoRepository.findByChapterId(chapter.getId());

        ChapterTodoResponse response = new ChapterTodoResponse();
        response.setChapterName(chapter.getTitle());
        response.setChapterId(chapter.getId());
        response.setNumOfTodos(todos.size());
        response.setChapterSequence(chapter.getSequence());
        response.setTodos(todos.stream().map(TodoSummary::new).toList());

        response.setType("chapter-issue");
        return response;
    }
}
